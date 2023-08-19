import React, { useEffect, useRef, useState } from "react";

import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FiCopy } from "react-icons/fi"

import "./App.css";
import logo from "./assets/logo_final.png";

const App = () => {
  const url = useRef();
  const [urlList, setUrlList] = useState([]);
  const [isloading,setIsLoading] = useState(false)
  const post = () => {
    const currValue = url.current.value
    if (!currValue) {
      toast.warning("URL cannot be empty");
      return;
    }
    var inputElement = document.createElement("input");
    inputElement.type = "url";
    inputElement.value = currValue;

    if (!inputElement.checkValidity()) {
      toast.error("Enter valid URL");
      return;
    }

    setIsLoading(true)
    
    axios
    .post("/shorten", { url: currValue })
    .then((res) => {
      setUrlList([res.data, ...urlList]);
      toast.success("URL is shortened... !"); 
      url.current.value = ""
    })
    .catch((err) => {
      toast.warning(err.response.data.message); //user already exists...toast
      url.current.value = ""
    })
    .finally(()=>{
        setIsLoading(false)
      })
  };

  useEffect(() => {
    axios.get("/all").then((res) => setUrlList(res.data));
  }, []);

  const formatDate = (date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-us", { dateStyle: "medium" });
  };

  return (
    <>
      <ToastContainer autoClose={2000} />
      <div className="main-container">
        <div className="nav">
          <div className="logo">
            <img src={logo} alt="" />
          </div>
        </div>
        <div className="inp-container">
          <input type="text" name="inp-url" onKeyDown={e => { if (e.key === "Enter") post() }} className="inp-url" ref={url} />
          <br />
          <div className="desc">
            <p>Enter full URL Eg: https://web-codeground.web.app</p>
          </div>
          <button onClick={post} className="minify-btn">
            Minify !
            {isloading && <span className="loader"></span>}
          </button>
        </div>

        <div className="url-list">
          <table>
            <thead>
              <tr>
                <th>Original URL</th>
                <th>Mini URL</th>
                <th>Copy</th>
                <th>Created on</th>
                <th>Clicks</th>
              </tr>
            </thead>

            <tbody className="data">
              {urlList.map((url) => {
                return (
                  <tr key={url._id}>
                    <td className="original">{url.original}</td>
                    <td>
                      <a
                        href={
                          new URL(window.location.href).origin + "/" + url.shorten
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        {url.shorten}
                      </a>
                    </td>
                    <td className="copy-icon"><span onClick={() => {
                      navigator.clipboard.writeText(new URL(window.location.href).origin + "/" + url.shorten)
                      toast.success("URL Copied to Clipboard")
                    }}><FiCopy /></span></td>
                    <td>{formatDate(url.created)}</td>
                    <td>{url.clicks}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default App;
