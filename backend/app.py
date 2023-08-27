from flask import Flask, request, jsonify, send_file
from gradio_client import Client
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/upload": {"origins": "http://127.0.0.1:5173"}})  # Adjust with your frontend URL
CORS(app, resources={r"/download": {"origins": "http://127.0.0.1:5173"}})  # Adjust with your frontend URL


# Initialize the Gradio client
client = Client("https://ysharma-explore-llamav2-with-tgi.hf.space/")

@app.route('/upload', methods=['POST'])
def upload_file():
    uploaded_file = request.files['files']
    
    if uploaded_file:
        # Read the content of the uploaded file
        file_content = uploaded_file.read()
        
        # Predict using Gradio client
        result = client.predict("fix the html code such that it follows WCAG convention" + "\n" + file_content.decode(),
                                api_name="/chat")
        
        stripped_string = result.rstrip('</s>')
        file_list=[]
        lines=stripped_string.split("\n")
        for line in lines:
            if "<" not in line:
                file_list.append("<!--"+line+"-->"+"\n")
            else:
                file_list.append(line+"\n")
        file=open('temp_file.html',"w+")
        file.writelines(file_list)
        file.flush()
        file.close()
        return jsonify({"message":"Changes Completed, Click on Download to Download your file"})

@app.route('/download', methods=['GET'])
def download_file():
    file_path = 'temp_file.html'
    return send_file(file_path, as_attachment=True)

if __name__ == '__main__':
    app.run()