import React, { useState, useEffect, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import myimg from './img2.png';

function Templateupdate() {
  const editor = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  console.log({id})
  const [formData, setFormData] = useState({
    tname: '',
    content: '',
    status: 'active',
  });

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/templates/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching template:', error);
      }
    };

    fetchTemplate();
  }, [id]);

  const handleCancel = () => {
    navigate(`/templatesdashboard/${id}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditor = (newContent) => {
    setFormData({ ...formData, content: newContent });
  };

  const Logout = () => {
    window.localStorage.setItem("isLoggedIn", false);
    navigate('/');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios({
        method: "PUT",
        url: `http://localhost:8000/templates/${id}`,
        data: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      navigate(`/templatesdashboard/${id}`);
    } catch (error) {
      console.error('Error updating template:', error);
    }
  };

  const config = useMemo(() => ({
		readonly: false,
		placeholder: 'Start typing...',
		showCharsCounter: false,
		showWordsCounter: false,
		showXPathInStatusbar: false,
		showStatusbar: false,
		enableDragAndDropFileToEditor: true,
		buttons: [
			'source', 'bold', 'italic', 'underline', 'strikethrough', 'eraser', 'ul', 'ol', 'outdent', 'indent', 'font', 'fontsize', 'brush', 'paragraph', 'image', 'video', 'table', 'link', 'align', 'undo', 'redo', 'hr', 'copyformat', 'fullsize', 'preview', 'print', 'about',
			{
				name: 'CF',
				tooltip: 'Insert Custom Field',
				popup: (editor) => {
					const div = editor.create.div();
					div.className = 'custom-dropdown';
					div.innerHTML = `
						<ul>
							<li data-value="{name}">{name}</li>
							<li data-value="{designation}">{designation}</li>
							<li data-value="{designation}">{designation}</li>
						</ul>
					`;
					div.addEventListener('click', (event) => {
						const value = event.target.getAttribute('data-value');
						if (value) {
							editor.selection.insertHTML(value);
						}
						
					});
					return div;
				}
			}
		]
	}), []);


  return (
    <div className="class1">
      <div className="navbar">
        <img className="img2" src={myimg} alt="my image" />
        <Link to="/adminhome" className="nav-link">DashBoard</Link>
        <div className="dropdown">
          <button className="dropbtn">Masters
            <i className="fa fa-caret-down"></i>
          </button>
          <div className="dropdown-content">
            <Link to="/organisation">Organisation</Link>
            <Link to="/user">User</Link>
          </div>
        </div>
        <div className="dropdown">
          <button className="dropbtn">Transaction
            <i className="fa fa-caret-down"></i>
          </button>
          <div className="dropdown-content">
            <Link to="/templates">Templates</Link>
            <Link to="/email">Email</Link>
            <Link to="/logs">Logs</Link>
          </div>
        </div>
        <div className="btn1">
          <button className="btn2" onClick={Logout}>Logout</button>
        </div>
      </div>
      <div className='divorg'>
        <form onSubmit={handleSubmit} action='POST'>
          <label>Template Name:
            <input className='input1' type="text" name="tname" value={formData.tname} onChange={handleChange} />
          </label>
          <label>Status:
            <select className='input1' name="status" value={formData.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="non-active">Non-Active</option>
            </select>
          </label>
          <div style={{ height: "100%", width: "100%" }}>
            <JoditEditor
              name="content"
              ref={editor}
              value={formData.content}
              config={config}
              tabIndex={1}
              onBlur={handleEditor}
            />
          </div>
          <button className='input1' type="submit">Save</button>
          <button className="input1" type="button" onClick={handleCancel}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default Templateupdate;
