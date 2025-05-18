import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  handleCategoryChange,
  handleDifficultyChange,
  handleTypeChange,
} from "../../redux/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const SelectField = ({ label, options }) => {
  const dispatch = useDispatch();

  // Get current selected values from Redux
  const category = useSelector((state) => state.category);
  const difficulty = useSelector((state) => state.difficulty);
  const questionType = useSelector((state) => state.type);

  // Determine value based on label
  let value = "";
  if (label === "Category") value = category;
  else if (label === "Difficulty") value = difficulty;
  else if (label === "Type") value = questionType;

  const handleChange = (value) => {
    switch (label) {
      case "Category":
        dispatch(handleCategoryChange(value));
        break;
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

  return (
    <div className="mt-5 space-y-2 w-full">
      <Label>{label}</Label>
      <Select onValueChange={handleChange} value={value}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options && options.map(({ id, name }) => (
            <SelectItem key={id} value={String(id)}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectField;