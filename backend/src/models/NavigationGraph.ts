import mongoose, { Document, Schema } from 'mongoose';

export interface INavigationGraph extends Document {
  from_node: string;
  to_node: string;
  distance: number;
  direction: string;
  instructions: string;
  landmarks: string[];
  is_accessible: boolean;
  floor_change: boolean;
  estimated_time: number;
  created_at: Date;
}

const NavigationGraphSchema = new Schema<INavigationGraph>({
  from_node: {
    type: String,
    required: true,
    ref: 'Location',
    index: true
  },
  to_node: {
    type: String,
    required: true,
    ref: 'Location',
    index: true
  },
  distance: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  direction: {
    type: String,
    required: true,
    enum: ['straight', 'left', 'right', 'up', 'down', 'diagonal']
  },
  instructions: {
    type: String,
    required: true
  },
  landmarks: [{
    type: String
  }],
  is_accessible: {
    type: Boolean,
    default: true
  },
  floor_change: {
    type: Boolean,
    default: false
  },
  estimated_time: {
    type: Number,
    required: true,
    min: 1,
    max: 300
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create compound index for efficient pathfinding queries
NavigationGraphSchema.index({ from_node: 1, to_node: 1 }, { unique: true });
NavigationGraphSchema.index({ from_node: 1 });
NavigationGraphSchema.index({ to_node: 1 });

export const NavigationGraph = mongoose.model<INavigationGraph>('NavigationGraph', NavigationGraphSchema); 