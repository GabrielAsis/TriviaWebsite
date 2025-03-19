import { Box, Button, CircularProgress, Typography } from "@mui/material"
import SelectField from "../src/Components/SelectField"
import TextFieldComp from "../src/Components/TextFieldComp";
import useAxios from "../src/hooks/useAxios";

const Settings = () => {
  const { response, error, loading } = useAxios({ url: "/api_category.php" });

  if (loading) {
    return (
      <Box mt={20}>
        <CircularProgress />
      </Box>
    );
  }

  if(error) {
    return (
      <Typography variant="h6" mt={20} color="red">
        Something Went Wrong!
      </Typography>
    )
  }

  const difficultyOptions = [
    { id: "easy", name: "Easy" },
    { id: "medium", name: "Medium" },
    { id: "hard", name: "Hard" },
  ]
 
  const typeOptions = [
    { id: "multiple", name: "Multiple Choice" },
    { id: "boolean", name: "True/False" },
  ]

  const handleSubmit = e => {
    e.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit}>
      <SelectField options={response.trivia_categories} label="category" />
      <SelectField options={difficultyOptions} label="Difficulty" />
      <SelectField options={typeOptions}  label="Type" />
      <TextFieldComp />
      <Box mt={3} width="100%"> 
        <Button variant="contained" fullWidth type="submit">
          Get Started
        </Button>
      </Box>
    </form>
  )
}

export default Settings