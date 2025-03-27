import { useDispatch } from "react-redux";
import { handleAmountChange } from "../../redux/actions";

const TextFieldComp = () => {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(handleAmountChange(e.target.value));
  };

  return (
    <div className="mt-5">
      <label className="block text-left mb-2 font-medium">Amount of Questions</label>
      <input
        type="number"
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default TextFieldComp;