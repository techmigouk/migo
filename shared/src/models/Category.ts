import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  icon: { type: String }, // Icon name or URL
  order: { type: Number, default: 0 }, // For sorting
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

// Generate slug from name before saving
CategorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

export const CategoryModel = mongoose.models.Category || mongoose.model('Category', CategorySchema);
