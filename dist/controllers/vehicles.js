"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehiclesController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const index_2 = require("../services/index");
exports.vehiclesController = {
    create: (async (req, res) => {
        try {
            await index_1.insertVehicleSchema.parseAsync(req.body);
            const { make, model, vin, engine_no, chassis_no, plate_number } = req.body;
            const existingVehicle = await (0, index_2.findVehicleByVin)(vin);
            if (existingVehicle) {
                return res.status(409).json({
                    message: `The vehicle with the VIN '${vin}' already exists. Please consider different VIN`,
                });
            }
            if (engine_no) {
                const existingVehicle = await (0, index_2.findVehicleByEngineNo)(engine_no);
                if (existingVehicle) {
                    return res.status(409).json({
                        message: `The vehicle with the same engine No '${engine_no}' already exists. Please consider different engine No.`,
                    });
                }
            }
            if (chassis_no) {
                const existingVehicle = await (0, index_2.findVehicleByChassisNo)(chassis_no);
                if (existingVehicle) {
                    return res.status(409).json({
                        message: `The vehicle with the same chassis No '${chassis_no}' already exists. Please consider different chassis No.`,
                    });
                }
            }
            if (plate_number) {
                const existingVehicle = await (0, index_2.findVehicleByPlateNumber)(plate_number);
                if (existingVehicle) {
                    return res.status(409).json({
                        message: `The vehicle with the same plate number '${plate_number}' already exists. Please consider different plate number.`,
                    });
                }
            }
            const [newVehicle] = await connection_1.db
                .insert(index_1.vehicles)
                .values({ ...req.body })
                .returning();
            if (!newVehicle) {
                return res.status(409).json({
                    message: `An error occurred while creating a vehicle "${make} ${model}". Please try again.`,
                });
            }
            res.status(201).json({
                message: `The vehicle "${make} ${model}" has been created successfully.`,
                vehicle: newVehicle,
            });
        }
        catch (error) {
            console.error("An error occurred while creating vehicle", error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors.map((e) => e.message),
                });
            }
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while creating the vehicle. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    retrieveAll: (async (req, res) => {
        try {
            const allVehicles = await connection_1.db.query.vehicles.findMany({
                orderBy: [(0, drizzle_orm_1.desc)(index_1.vehicles.created_at)],
                with: {
                    shipments: {
                        columns: {
                            id: false,
                            vehicle_id: false,
                        },
                    },
                },
            });
            res.status(200).json({
                message: "Vehicles retrieved successfully.",
                vehicles: allVehicles,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving vehicles", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving vehicles. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    retrieveByVIN: (async (req, res) => {
        try {
            const { vin } = req.params;
            const vehicle = await connection_1.db.query.vehicles.findFirst({
                where: (0, drizzle_orm_1.eq)(index_1.vehicles.vin, vin),
                orderBy: [(0, drizzle_orm_1.desc)(index_1.vehicles.created_at)],
                with: {
                    shipments: {
                        columns: {
                            id: false,
                            vehicle_id: false,
                        },
                    },
                },
            });
            if (!vehicle) {
                return res.status(404).json({
                    message: `No vehicle found with the provided VIN "${vin}". Please verify the VIN and try again.`,
                });
            }
            res.status(200).json({
                message: "Vehicle retrieved successfully.",
                vehicle,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving vehicle", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving vehicle. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    updateByVIN: (async (req, res) => {
        try {
            await index_1.updateVehicleSchema.parseAsync(req.body);
            const { vin } = req.params;
            const { make, model, year, color, mileage, engine_no, chassis_no, plate_number, cargo_capacity, type, vin: newVin, } = req.body;
            const existingVehicle = await (0, index_2.findVehicleByVin)(vin);
            if (!existingVehicle) {
                return res.status(404).json({
                    message: `No vehicle found with the provided VIN "${vin}". Please verify the VIN and try again.`,
                });
            }
            const { make: existingVehicleMake, model: existingVehicleModel, year: existingVehicleYear, color: existingVehicleColor, mileage: existingVehicleMileage, engine_no: existingVehicleEngineNo, chassis_no: existingVehicleChassisNo, plate_number: existingVehiclePlateNumber, cargo_capacity: existingVehicleCargoCapacity, type: existingVehicleType, vin: existingVehicleVin, } = existingVehicle;
            if (newVin && newVin !== existingVehicleVin) {
                const existingVehicle = await (0, index_2.findVehicleByVin)(newVin);
                if (existingVehicle) {
                    return res.status(409).json({
                        message: `The vehicle with the VIN "${newVin}" already exists. Please consider a different VIN.`,
                    });
                }
            }
            if (engine_no && engine_no !== existingVehicleEngineNo) {
                const existingVehicle = await (0, index_2.findVehicleByEngineNo)(engine_no);
                if (existingVehicle) {
                    return res.status(409).json({
                        message: `The vehicle with the same engine no '${engine_no}' already exists. Please consider different engine no.`,
                    });
                }
            }
            if (chassis_no && chassis_no !== existingVehicleChassisNo) {
                const existingVehicle = await (0, index_2.findVehicleByChassisNo)(chassis_no);
                if (existingVehicle) {
                    return res.status(409).json({
                        message: `The vehicle with the same chassis no '${chassis_no}' already exists. Please consider different chassis no.`,
                    });
                }
            }
            if (plate_number && plate_number !== existingVehiclePlateNumber) {
                const existingVehicle = await (0, index_2.findVehicleByPlateNumber)(plate_number);
                if (existingVehicle) {
                    return res.status(409).json({
                        message: `The vehicle with the same plate number '${plate_number}' already exists. Please consider different plate number.`,
                    });
                }
            }
            const updatedData = {
                make: make || existingVehicleMake,
                model: model || existingVehicleModel,
                year: year || existingVehicleYear,
                color: color || existingVehicleColor,
                mileage: mileage || existingVehicleMileage,
                engine_no: engine_no || existingVehicleEngineNo,
                chassis_no: chassis_no || existingVehicleChassisNo,
                vin: newVin || existingVehicleVin,
                plate_number: plate_number || existingVehiclePlateNumber,
                cargo_capacity: cargo_capacity || existingVehicleCargoCapacity,
                type: type || existingVehicleType,
                updated_at: new Date().toISOString(),
            };
            const [updatedVehicle] = await connection_1.db
                .update(index_1.vehicles)
                .set(updatedData)
                .where((0, drizzle_orm_1.eq)(index_1.vehicles.vin, vin))
                .returning();
            if (!updatedVehicle) {
                return res.status(404).json({
                    message: "An error occurred while updating the vehicle. Please try again.",
                });
            }
            res.status(200).json({
                message: `The vehicle "${updatedData.make} ${updatedData.model}" has been updated successfully.`,
                vehicle: updatedVehicle,
            });
        }
        catch (error) {
            console.error("An error occurred while updating vehicle", error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors.map((e) => e.message),
                });
            }
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while updating vehicle. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    deleteByVIN: (async (req, res) => {
        try {
            const { vin } = req.params;
            const [deletedVehicle] = await connection_1.db
                .delete(index_1.vehicles)
                .where((0, drizzle_orm_1.eq)(index_1.vehicles.vin, vin))
                .returning();
            if (!deletedVehicle) {
                return res.status(404).json({
                    message: `No vehicle found with the provided VIN "${vin}". Please verify the VIN and try again.`,
                });
            }
            res.status(200).json({
                message: `The vehicle "${deletedVehicle.make} ${deletedVehicle.model}" has been deleted successfully`,
            });
        }
        catch (error) {
            console.error("An error occurred while deleting vehicle by VIN", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while deleting vehicle. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
};
