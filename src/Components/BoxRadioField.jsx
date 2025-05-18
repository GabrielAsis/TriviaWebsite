import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  handleDifficultyChange,
  handleTypeChange,
} from "../../redux/actions";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const BoxRadioField = ({ label, options }) => {
  const dispatch = useDispatch();

  // Get current selected values from Redux
  const difficulty = useSelector((state) => state.difficulty);
  const questionType = useSelector((state) => state.type);

  // Determine value based on label
  let value = "";
  if (label === "Difficulty") value = difficulty;
  else if (label === "Type") value = questionType;

  const handleChange = (value) => {
    switch (label) {
      case "Difficulty":
        dispatch(handleDifficultyChange(value));
        break;
      case "Type":
        dispatch(handleTypeChange(value));
        break;
      default:
        return;
    }
  };

  // For Type, use a 2-column grid since there are only 2 options
  const gridCols = label === "Type" ? "grid-cols-2" : "grid-cols-3";

  return (
    <div className="mt-5 space-y-2 w-full">
      <Label>{label}</Label>
      <RadioGroup 
        value={value} 
        onValueChange={handleChange}
        className={`grid ${gridCols} gap-3 mt-2`}
      >
        {options && options.map(({ id, name }) => (
          <Label 
            key={id}
            htmlFor={`${label}-${id}`}
            className={`
              relative flex flex-col items-center justify-center border-2 rounded-xl p-4 h-20 cursor-pointer transition-all
              ${value === String(id) 
                ? 'border-primary bg-primary/10 shadow-md' 
                : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
              }
            `}
          >
            <RadioGroupItem 
              value={String(id)} 
              id={`${label}-${id}`} 
              className="absolute right-2 top-2 opacity-70"
            />
            <span className="text-lg font-medium cursor-pointer text-center">
              {name}
            </span>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
};

export default BoxRadioField;