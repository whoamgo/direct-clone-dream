import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import { fetchPrescriptions, uploadPrescription } from "@/store/slices/prescriptionSlice";
import { selectPrescriptions } from "@/store/selectors";

export const usePrescriptions = () => {
  const dispatch = useAppDispatch();
  const prescriptions = useAppSelector(selectPrescriptions);

  return {
    ...prescriptions,
    fetchPrescriptions: () => dispatch(fetchPrescriptions()),
    uploadPrescription: (fileName: string, note?: string) => dispatch(uploadPrescription({ fileName, note })),
  };
};
