import { Zoom } from "@mui/material";
import { OptionsObject, useSnackbar } from "notistack";

const useNotify = () => {
    const { enqueueSnackbar } = useSnackbar();

    const notify = (message: string, {variant, ...options}: OptionsObject) => {
        enqueueSnackbar(message, {
            variant,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            },
            TransitionComponent: Zoom,
            ...options
          });
    }
    return {notify};
};

export default useNotify;
