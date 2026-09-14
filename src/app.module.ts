// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
import { SubscriptionPlansSeedService } from './modules/subscriptions/services/subscription-plans-seed.service';
import { LoanSanService } from './services/loan-san.service';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

// =========================================================
// ENTIDADES
// =========================================================
import { Company } from './entities/company.entity';
import { Branch } from './branches/entities/branch.entity';
import { Client } from './entities/client.entity';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { ProductSerial } from './entities/product-serial.entity';
import { ProductComboItem } from './entities/product-combo-item.entity';
import { WarehouseInventory } from './entities/warehouse-inventory.entity';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { SubscriptionPlan } from './modules/subscriptions/entities/subscription-plan.entity';
import { Currency } from './entities/currency.entity';
import { ExchangeRate } from './entities/exchange-rate.entity';
import { AccountTransaction } from './entities/account-transaction.entity';
import { AccountInstallment } from './entities/account-installment.entity';
import { Employee } from './entities/employee.entity';
import { EmployeeCommission } from './entities/employee-commission.entity';
import { Loan } from './entities/loan.entity';
import { RepairOrder } from './entities/repair-order.entity';
import { CashierShift } from './entities/cashier-shift.entity';
import { DeliveryDispatch } from './entities/delivery-dispatch.entity';
import { WarehouseLocation } from './entities/warehouse-location.entity';
import { CompanyConfig } from './entities/company-config.entity';
import { TrialLog } from './entities/trial-log.entity';
import { Warehouse } from './entities/warehouse.entity';
import { UserSessionLog } from './entities/user-session-log.entity'; // (Ajusta la ruta si está en otra carpeta, por ejemplo './entities/user-session-log.entity')
import { Warranty } from './entities/warranty.entity';
import { ElectronicInvoice } from './entities/electronic-invoice.entity';
import { Tip } from './entities/tip.entity';
import { TipPayout } from './entities/tip-payout.entity';
import { DiningTable } from './entities/table.entity';
import { TableAccount } from './entities/table-account.entity';
import { TipRecord } from './entities/tip-record.entity';
import { TipPayoutBatch } from './entities/tip-payout-batch.entity';
import { Account } from './accounting/entities/account.entity';
import { JournalEntry } from './accounting/entities/journal-entry.entity';
import { JournalEntryLine } from './accounting/entities/journal-entry-line.entity';
import { Building } from './modules/maintenance/entities/building.entity';
import { AssetEquipment } from './modules/maintenance/entities/asset-equipment.entity';
import { WorkOrder } from './modules/maintenance/entities/work-order.entity';
import { WorkOrderPart } from './modules/maintenance/entities/work-order-part.entity';
import { MaintenanceSchedule } from './modules/maintenance/entities/maintenance-schedule.entity';
import { TireLog } from './modules/maintenance/entities/tire-log.entity';

// =========================================================
// MÓDULOS
// =========================================================
import { ProductModule } from './products/product.module';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { BranchesModule } from './branches/branches.module';
import { FinancialModule } from './financial/financial.module';
import { RepairModule } from './modules/repair.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { InsuranceModule } from './insurance/insurance.module';
import { InventoryBatchesModule } from './inventory-batches/inventory-batches.module';
import { FixedAssetsModule } from './fixed-assets/fixed-assets.module';
import { CompaniesModule } from './companies/company.module';
import { AccountingModule } from './accounting/accounting.module';
import { RestaurantModule } from './modules/restaurant.module';
import { ClientPortalModule } from './modules/client-portal.module';
import { CreditModule } from './modules/credit.module';
import { DeliveryDispatchModule } from './modules/delivery-dispatch.module';
import { ElectronicInvoiceModule } from './modules/electronic-invoice.module';
import { SubscriptionModule } from './modules/subscription.module';
import { SyncModule } from './modules/sync.module';
import { TipsModule } from './tips/tips.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';

// =========================================================
// CONTROLADORES
// =========================================================
import { WarehouseInventoryController } from './warehouse-inventory.controller';
import { SaleController } from './sales/sale.controller';
import { LoanController } from './controllers/loan.controller';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    ConfigModule.forRoot({ isGlobal: true }),
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin123',
      database: 'erp_saas_db',
      entities: [
        Company,
        CompanyConfig,
        Branch,
        Warehouse,
        Client,
        User,
        Product,
        ProductSerial,
        ProductComboItem,
        WarehouseInventory,
        Sale,
        SaleItem,
        SubscriptionPlan,
        Currency,
        ExchangeRate,
        AccountTransaction,
        AccountInstallment,
        Employee,
        EmployeeCommission,
        Loan,
        RepairOrder,
        CashierShift,
        WarehouseLocation,
        DeliveryDispatch,
        TrialLog,
		UserSessionLog,
        Warranty,
        ElectronicInvoice,
        Tip,
        TipPayout,
        DiningTable,
        TableAccount,
        TipRecord,
        TipPayoutBatch,
        Account,
        JournalEntry,
        JournalEntryLine,
        Building,
        AssetEquipment,
        WorkOrder,
        WorkOrderPart,
        MaintenanceSchedule,
        TireLog,
      ],
      synchronize: true,
    }),

    TypeOrmModule.forFeature([
      Company,
      WarehouseInventory,
      Sale,
      SaleItem,
      Loan,
      SubscriptionPlan,
    ]),

    // =======================================================
    // MÓDULOS DEL ERP
    // =======================================================
    AuthModule,
    BranchesModule,
    WarehousesModule,
    ProductModule,
    UserModule,
    FinancialModule,
    RepairModule,
    RestaurantsModule,
    AppointmentsModule,
    InsuranceModule,
    InventoryBatchesModule,
    FixedAssetsModule,
	CompaniesModule,
    AccountingModule,
    RestaurantModule,
    ClientPortalModule,
    CreditModule,
    DeliveryDispatchModule,
    ElectronicInvoiceModule,
    SubscriptionModule,
    SyncModule,
    TipsModule,
    MaintenanceModule,
  ],

  controllers: [
    WarehouseInventoryController,
    SaleController,
    LoanController,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Guard de autenticación global: exige JWT válido en TODAS las rutas
    // salvo las marcadas explícitamente con @Public() (login, register, webhooks).
    // Nest aplica los APP_GUARD en el orden en que se declaran: primero throttling,
    // luego autenticación.
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    LoanSanService,
    SubscriptionPlansSeedService,
  ],
})
export class AppModule {}
