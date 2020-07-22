from flask import Flask
from flask import request
from flask import Response
from flask_cors import CORS
app = Flask(__name__)
CORS(app)


@app.route('/')
def hello():
    name = "Hello World"
    return name


@app.route('/config', methods=["POST", "OPTIONS"])
def config():
    if request.method == "POST":
        data = request.json
        print(data)
        # resp = Response("hoge")
        # resp.headers['Access-Control-Allow-Origin'] = 'http://localhost:8080'
        return data
    return ""


# おまじない
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8070, threaded=True)
