import React, {FC} from "react";
import { Controller, Control, Path, FieldValues, useFormContext } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Autocomplete, {AutocompleteProps} from "@mui/material/Autocomplete";
import { Input } from "./Input";

type IProps = {
  name: string,
  label: string,
  options: {id: string, label: string}[]
} & Omit<AutocompleteProps<any, boolean, boolean, boolean>, "renderInput" | "options">

export const FormComplete: FC<IProps> = ({name, label, ...props}) => {
  const {control} = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        console.log(error)
        const { onChange, value, ref } = field;
        return (
          <Autocomplete
            value={value || (props.multiple ? [] : null)}
            fullWidth
            onChange={(event: any, newValue) => {
              console.log({newValue})
              onChange(newValue ?? null);
            }}
            {...props}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            getOptionLabel={option => option.label}
            renderInput={(params) => (
              <Input
                noRegister
                {...params}
                name={name}
                label={label}
                inputRef={ref}
              />
            )}
          />
        );
      }}
    />
  );
};
