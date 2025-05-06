import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../appStore";
import { uploadImageFunction } from "../images/UploadImageFunction";
import { Box, TextField, Button, IconButton, CircularProgress, Typography, Backdrop } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/CloudUpload";

interface Props {
  image: string;
  onClose: () => void;
}

export default function ImageEditor({ image, onClose }: Props) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log(image);
  }, []);

  const handleSubmit = async () => {
    if (!prompt) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("prompt", prompt);

    try {
      console.log(formData);
      
      const res = await fetch("http://localhost:5000/process-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResultUrl(data.output_url);
    } catch (err) {
      console.error("❌ Error processing image", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch(resultUrl);
      const blob = await response.blob();
      const processedFile = new File([blob], image, { type: blob.type });

      const fileDetails = {
        UserId: 123,
        Name: processedFile.name,
        FilePath: "",
        FileSize: processedFile.size,
        Type: processedFile.type,
      };

      await uploadImageFunction({
        file: processedFile,
        setUploading: setLoading,
        setError,
        setAlert,
        fileDetails,
        dispatch,
      });
    } catch (err) {
      console.error("❌ Error saving processed image", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Backdrop open sx={{ zIndex: 9999, backgroundColor: "rgba(0,0,0,0.9)" }}>
      <Box
        sx={{
          position: "relative",
          width: "90vw",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "#fff",
            zIndex: 10000,
          }}
        >
          <CloseIcon fontSize="large" />
        </IconButton>

        {loading && <CircularProgress sx={{ color: "#1CB5E0", mb: 2 }} />}

        <Box
          component="img"
          src={resultUrl || image}
          alt="preview"
          sx={{
            maxWidth: "80%",
            maxHeight: "70%",
            objectFit: "contain",
            borderRadius: 2,
            boxShadow: 3,
            mb: 2,
          }}
        />

        <TextField
          fullWidth
          placeholder="מה תרצי לשנות בתמונה?"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          sx={{ backgroundColor: "#fff", borderRadius: 1, mb: 2 }}
        />

        {!resultUrl ? (
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading || !prompt}
          >
            שלחי לעיבוד
          </Button>
        ) : (
          <Button
            onClick={handleSave}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
            sx={{ backgroundColor: "green", ":hover": { backgroundColor: "#2e7d32" } }}
          >
            שמרי בענן
          </Button>
        )}

        {alert && <Typography color="success.main" mt={2}>{alert}</Typography>}
        {error && <Typography color="error.main" mt={2}>{error}</Typography>}
      </Box>
    </Backdrop>
  );
}
