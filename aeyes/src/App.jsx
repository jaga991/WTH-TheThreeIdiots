import { useState } from 'react'
import { Box, Button } from '@chakra-ui/react'
import Dropzone from 'react-dropzone'
import "./styles.css";



function App() {
  const [fileNames, setFileNames] = useState([]);
  const [extractedHtml, setExtractedHTML] = useState("")
  const [oldCode, setOldCode] = useState("")
  const [newCode, setNewCode] = useState("")
  const [isButtonEnabled, setIsButtonEnabled] = useState(false)
  const handleDrop = async acceptedFiles => {
    try {
      const formData = new FormData();
      acceptedFiles.forEach(file => {
        formData.append("files", file); // Use "files" as the form field name
      });
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json(); // Parse the JSON response
        console.log(data)
      } else {
        console.error("File upload failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }

    
  }

  const handleDownload = async () => {
    try {
      setIsButtonEnabled(false); // Disable the button while the request is in progress

      const response = await fetch("http://localhost:5000/download", {
        method: "GET",
        // You can add headers or other configurations here if needed
      });

      if (response.ok) {
        const blob = await response.blob();

        // Create a temporary URL for the blob
        const url = window.URL.createObjectURL(blob);
  
        // Create a temporary anchor element to trigger the download
        const a = document.createElement("a");
        a.href = url;
        a.download = "filename.html"; // Set the desired filename and extension
        document.body.appendChild(a);
        a.click();
  
        // Clean up the temporary URL and anchor element
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
  
      } else {
        // Handle the error case, e.g., show an error message
        console.error("Download failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsButtonEnabled(true); // Re-enable the button after the request is complete
    }
  };

  return(
    <Box
      w="100vw"    // Set width to 100 viewport width
      h="100vh"    // Set height to 100 viewport height
      backgroundColor="#151322"  // Example background color
      color="white" // Example text color
      display="flex"
      flexDir="column"
      justifyContent="start"
      alignItems="center"
    >
      <Box
        w="100vw"    // Set width to 100 viewport width

        borderColor="white"         // Border color
        >
        <Dropzone
          onDrop={handleDrop}
          minSize={1024}
          maxSize={3072000}
          marginTop={20}
        >
          {({
            getRootProps,
            getInputProps,
            isDragActive,
            isDragAccept,
            isDragReject
          }) => {
            const additionalClass = isDragAccept
              ? "accept"
              : isDragReject
              ? "reject"
              : "";

            return (
              <div
                {...getRootProps({
                  className: `dropzone ${additionalClass}`
                })}
              >
                <input {...getInputProps()} />
                <span>{isDragActive ? "📂" : "📁"}</span>
                <p>Drag'n'drop html, or click to select file</p>
              </div>
            );
          }}
        </Dropzone>
      </Box>
          
      <Box
        w="100vw" 
        backgroundColor="#133333"  // Example background color
        border="2px solid white"
        display="flex"
        flexDir="row"
        justifyContent="start"
        alignItems="center"
      >
  <Button
    loadingText='Download'
    colorScheme='teal'
    variant='solid'
    alignSelf='center'
    justifySelf='center'
    onClick={handleDownload}
  >
    Download
  </Button>
      </Box>
    </Box>
  )

}

export default App
