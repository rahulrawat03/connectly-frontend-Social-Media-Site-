import axios from "axios";

const api = process.env.REACT_APP_API;

export async function registerUser(user) {
  await axios.post(`${api}/auth/register`, user);
}

export async function loginUser(user) {
  try {
    const response = await axios.post(`${api}/auth/login`, user);
    user = response.data;
    user.profilePicture =
      user.profilePicture && `${api}/images/${user.profilePicture}`;
    user.coverPicture =
      user.coverPicture && `${api}/images/${user.coverPicture}`;

    return user;
  } catch (ex) {
    if (ex.response && ex.response >= 400 && ex.response < 500)
      return console.log(ex.response.data);

    console.log(ex);
  }
}

export async function getUser(userId) {
  try {
    const response = await axios.get(`${api}/users?userId=${userId}`);
    const user = response.data;

    user.profilePicture =
      user.profilePicture && `${api}/images/${user.profilePicture}`;
    user.coverPicture =
      user.coverPicture && `${api}/images/${user.coverPicture}`;
    return user;
  } catch (ex) {}
}

export async function createPost(post) {
  try {
    const response = await axios.post(`${api}/upload`, post);
    response.data.img =
      response.data.img && `${api}/images/${response.data.img}`;
    return response.data;
  } catch (err) {}
}

export async function getTimelinePosts(userId) {
  try {
    const response = await axios.get(`${api}/posts/timeline/${userId}`);
    return response.data.map((d) => {
      d.img = d.img && `${api}/images/${d.img}`;
      return d;
    });
  } catch (ex) {}
}

export async function getPersonalPosts(userId) {
  try {
    const response = await axios.get(`${api}/posts/profile/${userId}`);
    return response.data.map((d) => {
      d.img = d.img && `${api}/images/${d.img}`;
      return d;
    });
  } catch (ex) {}
}

export async function likePost(postId, userId) {
  try {
    await axios.put(`${api}/posts/${postId}/like`, { userId });
  } catch (ex) {}
}

export async function commentOnPost(postId, userId, username, desc) {
  try {
    const comment = { userId, username, desc };
    await axios.put(`${api}/posts/${postId}/comment`, comment);
  } catch (ex) {}
}

export async function getNotes(userId) {
  try {
    const response = await axios.get(`${api}/users/${userId}/notes`);
    return response.data;
  } catch (ex) {}
}

export async function manageNotes(userId, add, title, note) {
  try {
    await axios.put(`${api}/users/${userId}/notes`, { add, title, note });
  } catch (ex) {}
}

export async function getEvents() {
  try {
    const response = await axios.get(`${api}/events`);
    return response.data;
  } catch (ex) {}
}

export async function postEvent(event) {
  try {
    await axios.post(`${api}/events`, event);
  } catch (ex) {}
}

export async function markPresence(eventId, userId) {
  try {
    await axios.put(`${api}/events/${eventId}`, { userId });
  } catch (ex) {}
}

export async function getProducts() {
  try {
    const response = await axios.get(`${api}/products/usual`);
    return response.data.map((p) => {
      p.img = p.img && `${api}/images/${p.img}`;
      return p;
    });
  } catch (ex) {}
}

export async function getBooks() {
  try {
    const response = await axios.get(`${api}/products/books`);
    return response.data.map((p) => {
      p.img = p.img && `${api}/images/${p.img}`;
      return p;
    });
  } catch (ex) {}
}

export async function postProduct(product) {
  try {
    const response = await axios.post(`${api}/products`, product);
    product = response.data;
    product.img = product.img && `${api}/images/${product.img}`;

    return product;
  } catch (ex) {}
}

export async function changeProfile(picture, userId) {
  try {
    const data = new FormData();
    data.append("picture", picture);

    await axios.put(`${api}/users/${userId}/picture`, data);
  } catch (ex) {}
}

export async function changeCover(cover, userId) {
  try {
    const data = new FormData();
    data.append("cover", cover);

    await axios.put(`${api}/users/${userId}/cover`, data);
  } catch (ex) {}
}

export async function changeDescription(desc, userId) {
  try {
    await axios.put(`${api}/users/${userId}/desc`, { desc });
  } catch (ex) {}
}

export async function searchPeople(query) {
  try {
    const response = await axios.get(`${api}/users/search/${query}`);
    return response.data.map((p) => {
      p.profilePicture =
        p.profilePicture && `${api}/images/${p.profilePicture}`;
      return p;
    });
  } catch (ex) {}
}

export async function searchEvents(query) {
  try {
    const response = await axios.get(`${api}/events/search/${query}`);
    return response.data;
  } catch (ex) {}
}

export async function searchProducts(query) {
  try {
    const response = await axios.get(`${api}/products/search/product/${query}`);
    return response.data.map((p) => {
      p.img = p.img && `${api}/images/${p.img}`;
      return p;
    });
  } catch (ex) {}
}

export async function searchBooks(query) {
  try {
    const response = await axios.get(`${api}/products/search/book/${query}`);
    return response.data.map((p) => {
      p.img = p.img && `${api}/images/${p.img}`;
      return p;
    });
  } catch (ex) {}
}

export async function sendRequest(userId, friendId) {
  try {
    const response = await axios.put(`${api}/users/${userId}/sendRequest`, {
      friendId,
    });

    const user = response.data;
    user.profilePicture =
      user.profilePicture && `${api}/images/${user.profilePicture}`;
    user.coverPicture =
      user.coverPicture && `${api}/images/${user.coverPicture}`;

    return user;
  } catch (ex) {}
}

export async function acceptRequest(userId, friendId) {
  try {
    const response = await axios.put(`${api}/users/${userId}/acceptRequest`, {
      friendId,
    });

    await axios.post(`${api}/conversations`, {
      senderId: userId,
      receiverId: friendId,
    });

    const user = response.data;
    user.profilePicture =
      user.profilePicture && `${api}/images/${user.profilePicture}`;
    user.coverPicture =
      user.coverPicture && `${api}/images/${user.coverPicture}`;

    return user;
  } catch (ex) {}
}

export async function resetNotifications(userId) {
  try {
    await axios.put(`${api}/users/${userId}/resetNotifications`, {});
  } catch (ex) {}
}

export async function getUserConversations(userId) {
  try {
    const response = await axios.get(`${api}/conversations/user/${userId}`);

    let conversations = response.data || [];
    return conversations.map((conv) => {
      if (conv.unseen?.includes(userId)) conv.notSeen = true;

      return conv;
    });
  } catch (ex) {}
}

export async function getConvDetails(userId, convId) {
  try {
    const response = await axios.get(`${api}/conversations/conv/${convId}`);
    const friendId =
      response.data.members[0] === userId
        ? response.data.members[1]
        : response.data.members[0];

    const friend = await getUser(friendId);
    return friend;
  } catch (ex) {}
}

export async function getMessages(convId) {
  try {
    const response = await axios.get(`${api}/messages/${convId}`);
    return response.data || [];
  } catch (ex) {}
}

export async function postMessage(userId, convId, text) {
  try {
    const response = await axios.post(`${api}/messages`, {
      senderId: userId,
      conversationId: convId,
      text,
    });

    const friend = await getConvDetails(userId, convId);

    await axios.put(`${api}/conversations/markUnseen/${convId}`, {
      userId: friend._id,
    });

    return response.data;
  } catch (ex) {}
}

export async function markSeenConversation(userId, convId) {
  try {
    await axios.put(`${api}/conversations/markSeen/${convId}`, { userId });
  } catch (ex) {}
}

export async function getUnseenConversationsCount(userId) {
  try {
    const conversations = await getUserConversations(userId);

    return conversations.some((c) => c.notSeen);
  } catch (ex) {}
}

export async function createConversation(senderId, receiverId) {
  try {
    const response = await axios.post(`${api}/conversations`, {
      senderId,
      receiverId,
    });
    return response.data;
  } catch (ex) {}
}
