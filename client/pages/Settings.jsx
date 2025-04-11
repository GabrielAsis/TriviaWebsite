import SelectField from "../src/Components/SelectField";
import TextFieldComp from "../src/Components/TextFieldComp";
import useAxios from "../src/hooks/useAxios";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { response, error, loading } = useAxios({ url: "/api_category.php" });
  const navigate = useNavigate();

  if (loading) {
    return <div className="mt-20 text-center">Loading...</div>;
  }

  if (error) {
    console.log("Error Details:", error);  // Log the actual error message
  console.log("Response Data:", response);  // Log the response data
    return (
      <div className="mt-20 text-center text-r  d-500">
        Something Went Wrong!
      </div>
    );
  }

  const difficultyOptions = [
    { id: "easy", name: "Easy" },
    { id: "medium", name: "Medium" },
    { id: "hard", name: "Hard" },
  ];

  const typeOptions = [
    { id: "multiple", name: "Multiple Choice" },
    { id: "boolean", name: "True/False" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/questions");
  };

  return (
    <form onSubmit={handleSubmit} className="text-left">
      <SelectField options={response.trivia_categories} label="Category" />
      <SelectField options={difficultyOptions} label="Difficulty" />
      <SelectField options={typeOptions} label="Type" />
      <TextFieldComp />
      <div className="mt-5">
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Get Started
        </button>
      </div>
    </form>
  );
};

export default Settings;