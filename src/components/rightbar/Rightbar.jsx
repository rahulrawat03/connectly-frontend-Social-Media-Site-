import "./rightbar.css";
import { useContext, useEffect, useState } from "react";
import { format } from "timeago.js";
import userContext from "../../context/userContext";
import { NoteAddSharp, ArrowForwardRounded, Remove } from "@material-ui/icons";
import { getSessionStart } from "../../services/localStorage";
import { getNotes, manageNotes } from "../../services/http";

function Rightbar() {
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const { user } = useContext(userContext);

  useEffect(() => {
    setInterval(() => {
      setDuration(format(getSessionStart()));
    }, 1000);
  }, []);

  useEffect(() => {
    const fetchNotes = async () => {
      const notes = await getNotes(user._id);
      if (notes) setNotes(notes);
    };

    fetchNotes();
  }, [user]);

  const addNote = async (e) => {
    e.preventDefault();

    if (!(title && note)) return;

    const newNote = { title, note };
    setNotes([...notes, newNote]);
    await manageNotes(user._id, true, title, note);
    setTitle("");
    setNote("");
  };

  const removeNote = async (title) => {
    setNotes(notes.filter((note) => note.title !== title));
    await manageNotes(user._id, false, title);
    setTitle("");
    setNote("");
  };

  return (
    <section className="rightbar">
      <div className="session-duration">
        Logged in <span className="time">{duration}</span>
      </div>
      <section className="notes">
        <form className="notes__heading" onSubmit={addNote}>
          <label htmlFor="notes__title">
            <NoteAddSharp className="notes__icon" />
          </label>
          <div className="notes__inputs">
            <input
              type="text"
              id="notes__title"
              placeholder="Title ..."
              value={title}
              onChange={({ currentTarget }) => setTitle(currentTarget.value)}
              autoComplete="off"
            />
            <textarea
              type="text"
              className="notes__input"
              placeholder="Text ..."
              value={note}
              onChange={({ currentTarget }) => setNote(currentTarget.value)}
              autoComplete="off"
            ></textarea>
            <button type="submit" className="add-note">
              Add
            </button>
          </div>
        </form>
        {notes?.map((note, index) => (
          <div key={index} className="note">
            <ArrowForwardRounded className="note__point" />
            <div className="note__text">
              <h3 className="note__title">{note.title}</h3>
              <p className="note__text">{note.note}</p>
            </div>
            <Remove
              className="note__remove"
              onClick={() => removeNote(note.title)}
            />
          </div>
        ))}
      </section>
    </section>
  );
}

export default Rightbar;
