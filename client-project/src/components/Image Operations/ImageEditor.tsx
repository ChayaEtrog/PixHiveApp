import { useState } from "react";
import { Button, IconButton, CircularProgress, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ErrorMessage from "../ErrorMessage";
import { GradientButton } from "../../styles/buttonsStyle";
import PromptInput from "./PromptInput";
import { DownloadEditedImage } from "./downloadAndPrintImage";
import { useLocation } from "react-router";

const url=import.meta.env.VITE_PYTHON_API_URL

export default function ImageEditor() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const image = location.state?.image;
  
  const handleSubmit = async () => {
    if (!prompt) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("prompt", prompt);

    try {
      const res = await fetch(`${url}/process-image`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResultUrl(data.output_url);
    } catch (err) {
      console.error("❌ Error processing image", url);
      setError("Error processing image");
    } finally {
      setLoading(false);
    }
  };

  const renderLoading = () => (
    <div style={{
      position: "fixed",
      top: -85,
      left: 0,
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9998,
      backgroundColor: "rgba(0,0,0,0.3)"
    }}>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e01cd5" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
      </svg>

      <CircularProgress
        sx={{
          marginBottom: "120px",
          'svg circle': { stroke: 'url(#my_gradient)' }
        }}
      />
    </div>
  );

  return (
    <div className="fullscreen-container">
      {loading && renderLoading()}

      {image && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9997,
            padding: 16,
          }}
        >
          <img
            src={resultUrl || image}
            alt="Edited"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: loading ? "none" : "block",
              width: "45%",
              maxHeight: "60%",
              objectFit: "contain",
              marginBottom: 16,
            }}
          />

          <IconButton
            sx={{ position: "absolute", top: 8, right: 34, color: "red" }}
            onClick={(e) => { e.stopPropagation();}}
          >
            <CloseIcon />
          </IconButton>

          {resultUrl && <Tooltip
            title="save"
            PopperProps={{
              modifiers: [{
                name: "zIndex", enabled: true, phase: "write",
                fn: ({ state }) => { state.styles.popper.zIndex = "9999"; },
              }],
            }}
          >
            <Button sx={GradientButton}
              style={{ position: "absolute", top: 30, left: 38 }}
              onClick={(e) => { e.stopPropagation(); DownloadEditedImage(resultUrl, "myimage.png", setIsDownloading); }}>{isDownloading ? "Downloading..." : "Download Edited Image"}</Button>
          </Tooltip>}

          {!resultUrl && (
            <>
              <PromptInput value={prompt} onChange={setPrompt} />
              <Button
                onClick={(e) => { handleSubmit(); e.stopPropagation() }}
                sx={GradientButton}
                disabled={loading || !prompt}
              >
                send
              </Button>
            </>
          )}
        </div>
      )}

      {error && <ErrorMessage message={error} />}
    </div>
  );
}

