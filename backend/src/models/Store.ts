import mongoose, { Document, Schema } from 'mongoose';

export interface IPromotion {
  title: string;
  valid_until: Date;
  is_active: boolean;
}

export interface IStore extends Document {
  store_id: string;
  name: string;
  floor: number;
  category: string;
  location: {
    x: number;
    y: number;
  };
  operating_hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  contact: string;
  description: string;
  promotions: IPromotion[];
  qr_location: string;
  created_at: Date;
  is_active: boolean;
}

const PromotionSchema = new Schema<IPromotion>({
  title: {
    type: String,
    required: true
  },
  valid_until: {
    type: Date,
    required: true
  },
  is_active: {
    type: Boolean,
    default: true
  }
});

const StoreSchema = new Schema<IStore>({
  store_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  floor: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  location: {
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
  operating_hours: {
    monday: {
      type: String,
      default: "9:00-18:00"
    },
    tuesday: {
      type: String,
      default: "9:00-18:00"
    },
    wednesday: {
      type: String,
      default: "9:00-18:00"
    },
    thursday: {
      type: String,
      default: "9:00-18:00"
    },
    friday: {
      type: String,
      default: "9:00-18:00"
    },
    saturday: {
      type: String,
      default: "9:00-18:00"
    },
    sunday: {
      type: String,
      default: "10:00-16:00"
    }
  },
  contact: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  },
  promotions: [PromotionSchema],
  qr_location: {
    type: String,
    required: true,
    ref: 'Location'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  is_active: {
    type: Boolean,
    default: true
  }
});

// Create indexes for common queries
StoreSchema.index({ floor: 1, category: 1 });
StoreSchema.index({ category: 1 });
StoreSchema.index({ qr_location: 1 });

export const Store = mongoose.model<IStore>('Store', StoreSchema); 