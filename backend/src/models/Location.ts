import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation extends Document {
  qr_id: string;
  floor: number;
  name: string;
  type: 'entrance' | 'shop' | 'intersection' | 'vertical' | 'amenity';
  coordinates: {
    x: number;
    y: number;
  };
  nearby_landmarks: string[];
  connected_nodes: string[];
  created_at: Date;
  is_active: boolean;
}

const LocationSchema = new Schema<ILocation>({
  qr_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  floor: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['entrance', 'shop', 'intersection', 'vertical', 'amenity']
  },
  coordinates: {
    x: {
      type: Number,
      required: true,
      min: 0,
      max: 9
    },
    y: {
      type: Number,
      required: true,
      min: 0,
      max: 9
    }
  },
  nearby_landmarks: [{
    type: String
  }],
  connected_nodes: [{
    type: String,
    ref: 'Location'
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
  is_active: {
    type: Boolean,
    default: true
  }
});

// Create compound index for floor and coordinates
LocationSchema.index({ floor: 1, 'coordinates.x': 1, 'coordinates.y': 1 });

export const Location = mongoose.model<ILocation>('Location', LocationSchema); 