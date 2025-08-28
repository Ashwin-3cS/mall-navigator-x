import { useState, useCallback, useEffect } from 'react';
import { RouteResponse, RouteStep } from '@/lib/api';

export interface NavigationSession {
  sessionId: string;
  startLocation: string;
  destination: string;
  currentStep: number;
  totalSteps: number;
  steps: RouteStep[];
  totalDistance: string;
  estimatedTime: string;
  startTime: Date;
  lastCheckpoint: Date | null;
  isActive: boolean;
  progress: number; // 0-100
}

export interface CheckpointResult {
  success: boolean;
  isCorrectCheckpoint: boolean;
  isDestination: boolean;
  nextStep?: RouteStep;
  remainingSteps: number;
  message: string;
}

export function useNavigationSession() {
  const [session, setSession] = useState<NavigationSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a new navigation session
  const createSession = useCallback((routeData: RouteResponse, startLocation: string, destination: string) => {
    const newSession: NavigationSession = {
      sessionId: routeData.session_id,
      startLocation,
      destination,
      currentStep: 1,
      totalSteps: routeData.steps.length,
      steps: routeData.steps,
      totalDistance: routeData.total_distance,
      estimatedTime: routeData.estimated_time,
      startTime: new Date(),
      lastCheckpoint: null,
      isActive: true,
      progress: 0,
    };
    
    setSession(newSession);
    setError(null);
    return newSession;
  }, []);

  // Validate a checkpoint (QR code scan)
  const validateCheckpoint = useCallback((qrId: string): CheckpointResult => {
    if (!session || !session.isActive) {
      return {
        success: false,
        isCorrectCheckpoint: false,
        isDestination: false,
        remainingSteps: 0,
        message: 'No active navigation session'
      };
    }

    const currentStep = session.steps[session.currentStep - 1];
    const isCorrectCheckpoint = currentStep.checkpoint_qr === qrId;
    const isDestination = session.currentStep === session.totalSteps;

    if (isCorrectCheckpoint) {
      // Update session progress
      const newProgress = Math.round((session.currentStep / session.totalSteps) * 100);
      const updatedSession: NavigationSession = {
        ...session,
        currentStep: session.currentStep + 1,
        lastCheckpoint: new Date(),
        progress: newProgress,
        isActive: session.currentStep < session.totalSteps,
      };

      setSession(updatedSession);

      if (isDestination) {
        return {
          success: true,
          isCorrectCheckpoint: true,
          isDestination: true,
          remainingSteps: 0,
          message: 'Congratulations! You have reached your destination!'
        };
      } else {
        const nextStep = session.steps[session.currentStep];
        return {
          success: true,
          isCorrectCheckpoint: true,
          isDestination: false,
          nextStep,
          remainingSteps: session.totalSteps - session.currentStep,
          message: `Great! Moving to step ${session.currentStep + 1}. ${nextStep.instruction}`
        };
      }
    } else {
      // Wrong checkpoint - find the correct one
      const correctStepIndex = session.steps.findIndex(step => step.checkpoint_qr === qrId);
      
      if (correctStepIndex !== -1) {
        // User scanned a different checkpoint - recalculate route from here
        const newProgress = Math.round(((correctStepIndex + 1) / session.totalSteps) * 100);
        const updatedSession: NavigationSession = {
          ...session,
          currentStep: correctStepIndex + 2, // +2 because we're moving to next step
          lastCheckpoint: new Date(),
          progress: newProgress,
          isActive: correctStepIndex + 1 < session.totalSteps,
        };
        
        setSession(updatedSession);
        
        return {
          success: true,
          isCorrectCheckpoint: false,
          isDestination: false,
          remainingSteps: session.totalSteps - (correctStepIndex + 1),
          message: `You're at a different location. Route recalculated from step ${correctStepIndex + 2}`
        };
      } else {
        // Unknown QR code
        return {
          success: false,
          isCorrectCheckpoint: false,
          isDestination: false,
          remainingSteps: session.totalSteps - session.currentStep + 1,
          message: 'Unknown QR code. Please scan the correct checkpoint.'
        };
      }
    }
  }, [session]);

  // Get current step information
  const getCurrentStep = useCallback(() => {
    if (!session || !session.isActive) return null;
    return session.steps[session.currentStep - 1];
  }, [session]);

  // Get next step information
  const getNextStep = useCallback(() => {
    if (!session || !session.isActive || session.currentStep >= session.totalSteps) return null;
    return session.steps[session.currentStep];
  }, [session]);

  // Get remaining steps
  const getRemainingSteps = useCallback(() => {
    if (!session || !session.isActive) return [];
    return session.steps.slice(session.currentStep);
  }, [session]);

  // Complete the session
  const completeSession = useCallback(() => {
    if (session) {
      setSession({
        ...session,
        isActive: false,
        progress: 100,
      });
    }
  }, [session]);

  // Cancel the session
  const cancelSession = useCallback(() => {
    setSession(null);
    setError(null);
  }, []);

  // Get session statistics
  const getSessionStats = useCallback(() => {
    if (!session) return null;
    
    const elapsedTime = session.lastCheckpoint 
      ? Math.round((session.lastCheckpoint.getTime() - session.startTime.getTime()) / 1000)
      : 0;
    
    return {
      elapsedTime,
      estimatedRemainingTime: Math.round((elapsedTime / session.progress) * (100 - session.progress)),
      averageStepTime: session.progress > 0 ? Math.round(elapsedTime / (session.currentStep - 1)) : 0,
    };
  }, [session]);

  return {
    // Session state
    session,
    loading,
    error,
    
    // Session management
    createSession,
    validateCheckpoint,
    completeSession,
    cancelSession,
    
    // Navigation helpers
    getCurrentStep,
    getNextStep,
    getRemainingSteps,
    getSessionStats,
    
    // Utility
    isActive: session?.isActive || false,
    progress: session?.progress || 0,
  };
} 