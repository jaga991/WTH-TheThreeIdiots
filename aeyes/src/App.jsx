import { useState } from 'react'
import { Box } from '@chakra-ui/react'
import Dropzone from 'react-dropzone'
import "./styles.css";



function App() {
  const [fileNames, setFileNames] = useState([]);
  const handleDrop = acceptedFiles => {
    setFileNames(acceptedFiles.map(file => file.name));
    console.log(acceptedFiles);
  }

  return(
    <Box
      w="100vw"    // Set width to 100 viewport width
      h="100vh"    // Set height to 100 viewport height
      backgroundColor="#151322"  // Example background color
      color="white" // Example text color
      display="flex"
      justifyContent="center"
      alignItems="start"
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
    </Box>
  )

}

export default App
