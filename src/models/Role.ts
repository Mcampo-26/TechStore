import mongoose, { Schema, model, models } from 'mongoose';

const RoleSchema = new Schema({
    name: { type: String, required: true, unique: true },
    // CAMBIA 'permisos' por 'permissions' para que coincida con el frontend
    permissions: {
      viewDash: { type: Boolean, default: false },
      viewUsuarios: { type: Boolean, default: false },
      viewRoles: { type: Boolean, default: false },
      viewStock: { type: Boolean, default: false },
      viewCarga: { type: Boolean, default: false },
      viewAuditoria: { type: Boolean, default: false },
    }
  }, { timestamps: true });
export default models.Role || model('Role', RoleSchema);