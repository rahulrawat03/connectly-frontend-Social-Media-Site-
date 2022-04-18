import "./feed.css";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { CheckCircle } from "@material-ui/icons";
import {
  getUser,
  getEvents,
  postEvent,
  markPresence,
} from "../../services/http";
import userContext from "../../context/userContext";

export function EventPost({ event, currentUser }) {
  const [user, setUser] = useState({});
  const [interested, setInterested] = useState(false);
  const [people, setPeople] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser(event.userId);
      setUser(user);
    };

    fetchUser();
    if (event.people.includes(currentUser._id)) setInterested(true);
    setPeople(event.people.length);
  }, [event, currentUser]);

  const showInterest = async () => {
    if (interested) setPeople(people - 1);
    else setPeople(people + 1);

    setInterested(!interested);
    await markPresence(event._id, currentUser._id);
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={user.profilePicture || "/images/profile.svg"}
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(event.createdAt)}</span>
          </div>
        </div>
        <div className="postCenter">
          <div className="postText postDetail">
            <span className="detailHeading">Event</span> {event.name}
          </div>
          <div className="postText postDetail">
            <span className="detailHeading">Venue</span> {event.venue}
          </div>
          <div className="postText postDetail">
            <span className="detailHeading">Date</span> {event.date}
          </div>
          <div className="postText postDetail">
            <span className="detailHeading">Time</span> {event.time}
          </div>
          <div className="postText postDetail">
            <span className="detailHeading">Description</span> {event.desc}
          </div>
        </div>
        <div className="postBottom eventBottom">
          <button className="interestedButton" onClick={showInterest}>
            Interested
          </button>
          {interested && <CheckCircle className="interestedIcon" />}
          <p className="interestedText">{people} people showed interest</p>
        </div>
      </div>
    </div>
  );
}

function Events() {
  const [events, setEvents] = useState([]);
  const { user: currentUser } = useContext(userContext);
  const [name, setName] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      const events = await getEvents();
      setEvents(events);
    };

    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(name && venue && date && time && desc)) return;

    const event = {
      userId: currentUser._id,
      name,
      venue,
      date,
      time,
      desc,
      people: [],
    };

    setEvents([event, ...events]);
    await postEvent(event);
  };

  return (
    <section className="feed">
      <div className="feedWrapper">
        <form className="eventPost" onSubmit={handleSubmit}>
          <h3 className="eventPostHeading">List an Event</h3>
          <input
            type="text"
            className="eventField"
            placeholder="Event..."
            value={name}
            onChange={({ currentTarget }) => setName(currentTarget.value)}
            autoFocus
          />
          <input
            type="text"
            className="eventField"
            value={venue}
            onChange={({ currentTarget }) => setVenue(currentTarget.value)}
            placeholder="Venue..."
          />
          <input
            type="text"
            className="eventField"
            value={date}
            onChange={({ currentTarget }) => setDate(currentTarget.value)}
            placeholder="Date..."
          />
          <input
            type="text"
            className="eventField"
            value={time}
            onChange={({ currentTarget }) => setTime(currentTarget.value)}
            placeholder="Time..."
          />
          <input
            type="text"
            className="eventField"
            value={desc}
            onChange={({ currentTarget }) => setDesc(currentTarget.value)}
            placeholder="Description..."
          />
          <button type="submit" className="eventPostButton">
            Register
          </button>
        </form>
        {events.map((event, index) => (
          <EventPost key={index} event={event} currentUser={currentUser} />
        ))}
        ;
      </div>
    </section>
  );
}

export default Events;
