// src/users/user.controller.ts
import { Controller, Post, Get, Body, Req, ForbiddenException } from '@nestjs/common';
import { UserService } from '../users/user.service';

// Mapea el "Cargo / Perfil" elegido en el formulario (subRole) al
// "departamento" (role) que usa el dashboard para decidir qué panel
// mostrar (GeneralManagerDashboard, SalesDashboard, FinanceDashboard,
// InventoryDashboard). Si se agrega un cargo nuevo en el frontend,
// agregarlo aquí también.
const SUBROLE_TO_ROLE: Record<string, string> = {
  'cajero-cobrador': 'sales',
  'vendedor': 'sales',
  'gerente-financiero': 'finance',
  'gerente-almacen': 'inventory',
};

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  // Solo el admin de la empresa puede registrar colaboradores.
  @Post('employees')
  async createEmployee(
    @Req() req: any,
    @Body() body: { name: string; email: string; password: string; subRole: string; branchId?: string },
  ) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Solo un administrador puede registrar colaboradores.');
    }

    const companyId = req.user.companyId;
    const role = SUBROLE_TO_ROLE[body.subRole] || 'sales';

    const user = await this.userService.create({
      name: body.name,
      email: body.email,
      password: body.password,
      role,
      subRole: body.subRole,
      companyId,
      branchId: body.branchId,
      mustChangePassword: true, // contraseña temporal asignada por el admin
    });

    return {
      message: 'Colaborador creado exitosamente',
      user,
    };
  }

  // Lista los colaboradores de la propia empresa (solo admin).
  @Get()
  async findAll(@Req() req: any) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Solo un administrador puede ver la lista de colaboradores.');
    }
    return await this.userService.findAllByCompany(req.user.companyId);
  }
}
