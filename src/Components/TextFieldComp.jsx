import { useDispatch } from "react-redux";
import { handleAmountChange } from "../../redux/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TextFieldComp = () => {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(handleAmountChange(e.target.value));
  };

  return (
    <div className="mt-5 space-y-2">
      <Label htmlFor="amount">Amount of Questions</Label>
      <Input
        id="amount"
        type="number"
        onChange={handleChange}
        placeholder="Enter number of questions"
      />
    </div>
  );
};

export default TextFieldComp;
