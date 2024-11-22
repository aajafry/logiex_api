import { eq, or, ilike, desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "../database/connection.js";
import {
  insertVehicleSchema,
  updateVehicleSchema,
  vehicles,
} from "../schemas/index.js";
import {
  findVehicleByVin,
  findVehicleByEngineNo,
  findVehicleByChassisNo,
  findVehicleByPlateNumber,
} from "../services/index.js";

export const vehiclesController = {
  create: async (req, res) => {
    try {
      await insertVehicleSchema.parseAsync(req.body);

      const { make, model, vin, engine_no, chassis_no, plate_number } =
        req.body;
      const existingVehicle = await findVehicleByVin(vin);
      if (existingVehicle) {
        return res.status(409).json({
          message: `The vehicle with the VIN '${vin}' already exists. Please consider different VIN`,
        });
      }

      if (engine_no) {
        const existingVehicle = await findVehicleByEngineNo(engine_no);
        if (existingVehicle) {
          return res.status(409).json({
            message: `The vehicle with the same engine No '${engine_no}' already exists. Please consider different engine No.`,
          });
        }
      }
      if (chassis_no) {
        const existingVehicle = await findVehicleByChassisNo(chassis_no);
        if (existingVehicle) {
          return res.status(409).json({
            message: `The vehicle with the same chassis No '${chassis_no}' already exists. Please consider different chassis No.`,
          });
        }
      }
      if (plate_number) {
        const existingVehicle = await findVehicleByPlateNumber(plate_number);
        if (existingVehicle) {
          return res.status(409).json({
            message: `The vehicle with the same plate number '${plate_number}' already exists. Please consider different plate number.`,
          });
        }
      }

      const [newVehicle] = await db
        .insert(vehicles)
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
    } catch (error) {
      console.error("An error occurred while creating vehicle", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        });
      }
      res.status(500).json({
        message:
          "An unexpected error occurred while creating the vehicle. Please try again.",
        error: error.message,
      });
    }
  },
  retrieveAll: async (req, res) => {
    try {
      const allVehicles = await db.query.vehicles.findMany({
        orderBy: [desc(vehicles.created_at)],
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
    } catch (error) {
      console.error("An error occurred while retrieving vehicles", error);
      res.status(500).json({
        message:
          "An unexpected error occurred while retrieving vehicles. Please try again.",
        error: error.message,
      });
    }
  },
  retrieveByVIN: async (req, res) => {
    try {
      const { vin } = req.params;
      const vehicle = await db.query.vehicles.findFirst({
        where: eq(vehicles.vin, vin),
        orderBy: [desc(vehicles.created_at)],
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
    } catch (error) {
      console.error("An error occurred while retrieving vehicle", error);
      res.status(500).json({
        message:
          "An unexpected error occurred while retrieving vehicle. Please try again.",
        error: error.message,
      });
    }
  },
  updateByVIN: async (req, res) => {
    try {
      await updateVehicleSchema.parseAsync(req.body);
      const { vin } = req.params;
      const {
        make,
        model,
        year,
        color,
        mileage,
        engine_no,
        chassis_no,
        plate_number,
        cargo_capacity,
        type,
        vin: newVin,
      } = req.body;

      const existingVehicle = await findVehicleByVin(vin);
      if (!existingVehicle) {
        return res.status(404).json({
          message: `No vehicle found with the provided VIN "${vin}". Please verify the VIN and try again.`,
        });
      }

      const {
        make: existingVehicleMake,
        model: existingVehicleModel,
        year: existingVehicleYear,
        color: existingVehicleColor,
        mileage: existingVehicleMileage,
        engine_no: existingVehicleEngineNo,
        chassis_no: existingVehicleChassisNo,
        plate_number: existingVehiclePlateNumber,
        cargo_capacity: existingVehicleCargoCapacity,
        type: existingVehicleType,
        vin: existingVehicleVin,
      } = existingVehicle;

      if (newVin && newVin !== existingVehicleVin) {
        const existingVehicle = await findVehicleByVin(newVin);
        if (existingVehicle) {
          return res.status(409).json({
            message: `The vehicle with the VIN "${newVin}" already exists. Please consider a different VIN.`,
          });
        }
      }

      if (engine_no && engine_no !== existingVehicleEngineNo) {
        const existingVehicle = await findVehicleByEngineNo(engine_no);

        if (existingVehicle) {
          return res.status(409).json({
            message: `The vehicle with the same engine no '${engine_no}' already exists. Please consider different engine no.`,
          });
        }
      }

      if (chassis_no && chassis_no !== existingVehicleChassisNo) {
        const existingVehicle = await findVehicleByChassisNo(chassis_no);

        if (existingVehicle) {
          return res.status(409).json({
            message: `The vehicle with the same chassis no '${chassis_no}' already exists. Please consider different chassis no.`,
          });
        }
      }

      if (plate_number && plate_number !== existingVehiclePlateNumber) {
        const existingVehicle = await findVehicleByPlateNumber(plate_number);
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

      const [updatedVehicle] = await db
        .update(vehicles)
        .set(updatedData)
        .where(eq(vehicles.vin, vin))
        .returning();

      if (!updatedVehicle) {
        return res.status(404).json({
          message:
            "An error occurred while updating the vehicle. Please try again.",
        });
      }

      res.status(200).json({
        message: `The vehicle "${updatedData.make} ${updatedData.model}" has been updated successfully.`,
        vehicle: updatedVehicle,
      });
    } catch (error) {
      console.error("An error occurred while updating vehicle", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        });
      }
      res.status(500).json({
        message:
          "An unexpected error occurred while updating vehicle. Please try again.",
        error: error.message,
      });
    }
  },
  deleteByVIN: async (req, res) => {
    try {
      const { vin } = req.params;
      const [deletedVehicle] = await db
        .delete(vehicles)
        .where(eq(vehicles.vin, vin))
        .returning();

      if (!deletedVehicle) {
        return res.status(404).json({
          message: `No vehicle found with the provided VIN "${vin}". Please verify the VIN and try again.`,
        });
      }

      res.status(200).json({
        message: `The vehicle "${deletedVehicle.make} ${deletedVehicle.model}" has been deleted successfully`,
      });
    } catch (error) {
      console.error("An error occurred while deleting vehicle by VIN", error);
      res.status(500).json({
        message:
          "An unexpected error occurred while deleting vehicle. Please try again.",
        error: error.message,
      });
    }
  },
};
