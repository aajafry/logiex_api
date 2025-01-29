"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipmentsController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
const connection_1 = require("../database/connection");
const index_1 = require("../schemas/index");
const index_2 = require("../services/index");
exports.shipmentsController = {
    create: (async (req, res) => {
        try {
            const { shipment_id, shipment_date, vehicle_vin, captain_id, status, orders, } = req.body;
            await index_1.insertShipmentSchema.parseAsync({
                shipment_id,
                shipment_date,
                vehicle_vin,
                captain_id,
                status,
            });
            const existingShipment = await (0, index_2.findShipmentBySid)(shipment_id);
            if (existingShipment) {
                return res.status(409).json({
                    message: `The shipment with the Shipment ID "${shipment_id}" already exists. Please choose a different Shipment ID.`,
                });
            }
            const userHasPermission = await (0, index_2.findUserByIdAndRole)(captain_id, "captain");
            if (!userHasPermission) {
                return res.status(404).json({
                    message: "Captain does not have permissions to associate with shipment.",
                });
            }
            const vehicleValidation = await (0, index_2.findVehicleByVin)(vehicle_vin);
            if (!vehicleValidation) {
                return res.status(404).json({
                    message: `No vehicle found with the provided VIN "${vehicle_vin}". Please verify the VIN and try again.`,
                });
            }
            const newShipmentData = {
                shipment_id,
                shipment_date: shipment_date ? shipment_date : new Date().toISOString(),
                vehicle_vin,
                captain_id,
                status,
            };
            let newShipment;
            const shipmentOrders = [];
            if (Array.isArray(orders) && orders.length > 0) {
                const orderErrors = [];
                await Promise.all(orders.map(async (order) => {
                    await index_1.insertShipmentProductSchema.parseAsync(order);
                    const orderVerification = await (0, index_2.findSaleByBillId)(order.bill_id);
                    if (!orderVerification) {
                        orderErrors.push(`Order with bill ID "${order.bill_id}" was not found. Please verify the BILL ID.`);
                        return null;
                    }
                    return order;
                }));
                if (orderErrors.length > 0) {
                    return res.status(404).json({ message: orderErrors });
                }
                await connection_1.db.transaction(async (tx) => {
                    [newShipment] = await tx
                        .insert(index_1.shipments)
                        .values(newShipmentData)
                        .returning();
                    for (const order of orders) {
                        const { bill_id } = order;
                        const [newOrder] = await tx
                            .insert(index_1.shipmentProducts)
                            .values({
                            shipment_id: newShipmentData.shipment_id,
                            bill_id,
                        })
                            .returning();
                        shipmentOrders.push(newOrder);
                    }
                });
            }
            else {
                [newShipment] = await connection_1.db
                    .insert(index_1.shipments)
                    .values(newShipmentData)
                    .returning();
            }
            res.status(201).json({
                message: `The shipment "${shipment_id}" has been created successfully`,
                shipment: newShipment,
                orders: shipmentOrders,
            });
        }
        catch (error) {
            console.error("An error occurred while creating a new shipment", error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors.map((e) => e.message),
                });
            }
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while creating the shipment. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    retrieveAll: (async (req, res) => {
        try {
            const allShipments = await connection_1.db.query.shipments.findMany({
                orderBy: [(0, drizzle_orm_1.desc)(index_1.shipments.created_at)],
                columns: {
                    vehicle_vin: false,
                    captain_id: false,
                },
                with: {
                    vehicle: {
                        columns: {
                            id: false,
                        },
                    },
                    captain: {
                        columns: {
                            id: false,
                            password: false,
                            last_login_at: false,
                            login_count: false,
                            failed_login_attempt_count: false,
                            failed_login_attempt_last_at: false,
                            reset_password_token: false,
                            reset_password_token_expired_at: false,
                            created_by: false,
                        },
                        with: {
                            creator: {
                                columns: {
                                    id: false,
                                    password: false,
                                    national_id: false,
                                    driving_license_no: false,
                                    passport_no: false,
                                    last_login_at: false,
                                    login_count: false,
                                    failed_login_attempt_count: false,
                                    failed_login_attempt_last_at: false,
                                    reset_password_token: false,
                                    reset_password_token_expired_at: false,
                                    created_by: false,
                                    created_at: false,
                                    updated_at: false,
                                },
                            },
                        },
                    },
                    items: {
                        columns: {
                            shipment_id: false,
                        },
                        with: {
                            sale: true,
                        },
                    },
                },
            });
            res.status(200).json({
                message: "Shipments retrieved successfully",
                shipments: allShipments,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving the shipments", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving shipments. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    retrieveByShipmentId: (async (req, res) => {
        try {
            const { shipmentId } = req.params;
            const shipment = await connection_1.db.query.shipments.findFirst({
                where: (0, drizzle_orm_1.ilike)(index_1.shipments.shipment_id, shipmentId),
                orderBy: [(0, drizzle_orm_1.desc)(index_1.shipments.created_at)],
                columns: {
                    vehicle_vin: false,
                    captain_id: false,
                },
                with: {
                    vehicle: true,
                    captain: {
                        columns: {
                            password: false,
                            last_login_at: false,
                            login_count: false,
                            failed_login_attempt_count: false,
                            failed_login_attempt_last_at: false,
                            reset_password_token: false,
                            reset_password_token_expired_at: false,
                            created_by: false,
                        },
                        with: {
                            creator: {
                                columns: {
                                    id: false,
                                    password: false,
                                    national_id: false,
                                    driving_license_no: false,
                                    passport_no: false,
                                    last_login_at: false,
                                    login_count: false,
                                    failed_login_attempt_count: false,
                                    failed_login_attempt_last_at: false,
                                    reset_password_token: false,
                                    reset_password_token_expired_at: false,
                                    created_by: false,
                                    created_at: false,
                                    updated_at: false,
                                },
                            },
                        },
                    },
                    items: {
                        columns: {
                            shipment_id: false,
                        },
                        with: {
                            sale: {
                                columns: {
                                    customer_id: false,
                                },
                                with: {
                                    customer: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!shipment) {
                return res.status(404).json({
                    message: `The shipment "${shipmentId}" was not found. Please verify the Shipment ID and try again.`,
                });
            }
            res.status(200).json({
                message: "Shipment retrieved successfully",
                shipment,
            });
        }
        catch (error) {
            console.error("An error occurred while retrieving the shipment", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while retrieving the shipment. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    updateByShipmentId: (async (req, res) => {
        try {
            const { shipmentId } = req.params;
            const { shipment_id, shipment_date, vehicle_vin, captain_id, status, orders, } = req.body;
            await index_1.updateShipmentSchema.parseAsync({
                shipment_id,
                shipment_date,
                vehicle_vin,
                captain_id,
                status,
            });
            const existingShipment = await (0, index_2.findShipmentBySid)(shipmentId);
            if (!existingShipment) {
                return res.status(404).json({
                    message: `The shipment "${shipmentId}" was not found. Please verify the Shipment ID and try again.`,
                });
            }
            const { shipment_id: existingShipmentSID, shipment_date: existingShipmentDate, captain_id: existingShipmentCID, vehicle_vin: existingShipmentVIN, status: existingShipmentStatus, } = existingShipment;
            if (shipment_id && shipment_id !== existingShipmentSID) {
                const shipmentValidation = await (0, index_2.findShipmentBySid)(shipment_id);
                if (shipmentValidation) {
                    return res.status(409).json({
                        message: `The shipment with the Shipment ID "${shipment_id}" already exists. Please choose a different Shipment ID.`,
                    });
                }
            }
            if (captain_id && captain_id !== existingShipmentCID) {
                const captainValidation = await (0, index_2.findUserByIdAndRole)(captain_id, "captain");
                if (!captainValidation) {
                    return res.status(404).json({
                        message: "Captain does not have permissions to associate with shipment.",
                    });
                }
            }
            if (vehicle_vin && vehicle_vin !== existingShipmentVIN) {
                const vehicleValidation = await (0, index_2.findVehicleByVin)(vehicle_vin);
                if (!vehicleValidation) {
                    return res.status(404).json({
                        message: `The vehicle with the provided vehicle VIN "${vehicle_vin}" was not found. Please verify the vehicle VIN.`,
                    });
                }
            }
            const updatedData = {
                shipment_id: shipment_id || existingShipmentSID,
                shipment_date: shipment_date || existingShipmentDate,
                captain_id: captain_id || existingShipmentCID,
                vehicle_vin: vehicle_vin || existingShipmentVIN,
                status: status || existingShipmentStatus,
                updated_at: new Date().toISOString(),
            };
            let updatedShipment;
            const shipmentOrders = [];
            if (Array.isArray(orders) && orders.length > 0) {
                const orderErrors = [];
                await Promise.all(orders.map(async (order) => {
                    await index_1.insertShipmentProductSchema.parseAsync(order);
                    const orderVerification = await (0, index_2.findSaleByBillId)(order.bill_id);
                    if (!orderVerification) {
                        orderErrors.push(`Order with bill ID ${order.bill_id} was not found. Please verify the BILL ID.`);
                        return;
                    }
                    const [billVerification] = await connection_1.db
                        .select()
                        .from(index_1.shipmentProducts)
                        .where((0, drizzle_orm_1.ilike)(index_1.shipmentProducts.bill_id, order.bill_id))
                        .limit(1);
                    if (billVerification) {
                        orderErrors.push(`Order with bill ID "${order.bill_id}" already exists for the shipment "${shipmentId}". Please choose a different BILL ID for this order.`);
                        return;
                    }
                }));
                if (orderErrors.length > 0) {
                    return res.status(404).json({ message: orderErrors });
                }
                await connection_1.db.transaction(async (tx) => {
                    [updatedShipment] = await tx
                        .update(index_1.shipments)
                        .set(updatedData)
                        .where((0, drizzle_orm_1.ilike)(index_1.shipments.shipment_id, shipmentId))
                        .returning();
                    for (const order of orders) {
                        const { bill_id } = order;
                        const [newOrder] = await tx
                            .insert(index_1.shipmentProducts)
                            .values({
                            shipment_id: updatedData.shipment_id,
                            bill_id,
                        })
                            .returning();
                        shipmentOrders.push(newOrder);
                    }
                });
            }
            else {
                [updatedShipment] = await connection_1.db
                    .update(index_1.shipments)
                    .set(updatedData)
                    .where((0, drizzle_orm_1.ilike)(index_1.shipments.shipment_id, shipmentId))
                    .returning();
            }
            if (!updatedShipment) {
                return res.status(409).json({
                    message: `An error occurred while updating the shipment "${shipmentId}". Please try again.`,
                });
            }
            res.status(200).json({
                message: `The Shipment "${shipmentId}" has been updated successfully`,
                shipment: updatedShipment,
            });
        }
        catch (error) {
            console.error("An error occurred while updating shipment", error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors.map((e) => e.message),
                });
            }
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while updating the shipment. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
    deleteByShipmentId: (async (req, res) => {
        try {
            const { shipmentId } = req.params;
            const [deletedShipment] = await connection_1.db
                .delete(index_1.shipments)
                .where((0, drizzle_orm_1.ilike)(index_1.shipments.shipment_id, shipmentId))
                .returning();
            if (!deletedShipment) {
                return res.status(404).json({
                    message: `The shipment "${shipmentId}" was not found. Please verify the Shipment ID and try again.`,
                });
            }
            res.status(200).json({
                message: `The shipment "${shipmentId}" has been deleted successfully`,
            });
        }
        catch (error) {
            console.error("An error occurred while deleting a shipment", error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: "An unexpected error occurred while deleting the shipment. Please try again.",
                    error: error.message,
                });
            }
        }
    }),
};
