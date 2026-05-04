import * as yup from "yup";
import { nameofFactory } from "common/utilities/nameofFactory";

export interface CutModel {
    id: number;
    instanceId: number | undefined;
    length: number;
    quantity: number | null;
    name: string | undefined;
}

export const nameofCutModel = nameofFactory<CutModel>();

export const CutModelValidationSchema: yup.SchemaOf<CutModel> = yup.object().shape({
    id: yup.number().typeError("must be number").required("is required"),
    instanceId: yup.number().typeError("must be number").optional(),
    length: yup.number().typeError("must be number").required("is required"),
    quantity: yup.number().typeError("must be number").required("is required"),
    name: yup.string().typeError("must be string").optional(),
});
