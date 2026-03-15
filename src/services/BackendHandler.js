const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const Login = async ({ rollNoOrEmailValue, passwordValue }) => {

  try {
    const data = { rollNoOrEmail: rollNoOrEmailValue, password: passwordValue };
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
      credentials: "include"
    });
    const result = await response.json();
    console.log(result);
    return { rollNo: result.rollNo, email: result.email, name: result.name };
  } catch (error) {
    console.error("Error during login:", error);
  }
}
const Register = async ({ emailValue, rollNoValue, passwordValue, nameValue }) => {
  try {
    const data = { email: emailValue, rollNo: rollNoValue, password: passwordValue, name: nameValue };
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
      credentials: "include"
    });
    const result = await response.json();
    console.log(result);
  }
  catch (error) {
    console.error("Error during registration:", error);
  }
}
const checkLogin = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/checkLogin`, {
      method: "GET",
      credentials: "include"
    });
    if (response.ok) {
      const result = await response.json();
      console.log("User is logged in");

      return result;
    }
    else {
      console.log("User is not logged in");
      return null;
    }
  }
  catch (error) {
    console.error("Error during login check:", error);
    return null;
  }
}
const PostArticle = async ({ data, editingArticleId }) => {
  try {
    const method = editingArticleId ? "PUT" : "POST";
    const url = editingArticleId
      ? `${BACKEND_URL}/api/article/update/${editingArticleId}`
      : `${BACKEND_URL}/api/article/post`;

    // data.content is already a structured blocks array from parseStoryToBlocks()
    const articleData = {
      title: data.title,
      content: data.content,       // ← blocks array, not a string
      coverImageUrl: data.coverImageUrl || null,
      status: data.status || 'published',
    };

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Article posting failed");
    }

    const result = await response.json();
    console.log("Article posted:", result);
    return result;
  } catch (error) {
    console.error("Error posting article:", error);
    return null;
  }
};
const imageUpload = async ({ data }) => {
  try {
    const formData = new FormData();
    formData.append('image', data.file);
    const response = await fetch(`${BACKEND_URL}/api/article/upload-image`, {
      method: "POST",
      body: formData,
      credentials: "include"
    })
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Image upload failed");
    }
    if (result.imageUrl) {
      return result.imageUrl;
    }
    return null;
  }
  catch (error) {
    console.error("Error uploading image:", error);
  }
}
const handleLogout = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (response.ok) {
      console.log("Logout confirmed");
      return true
    }
  }
  catch (error) {
    console.error('Error:', error);
  }
}
const deleteArticle = async ({ articleId }) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/article/delete/${articleId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (response.ok) {
      console.log("Article deleted");
      return true
    }
  }
  catch (error) {
    console.error('Error:', error);
  }
}

// Add these to your existing BackendHandler.js

const toggleFollow = async (userId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/follow/${userId}`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Follow failed');
    return await response.json(); // { following, followersCount, followingCount }
  } catch (error) {
    console.error('Error toggling follow:', error);
    return null;
  }
};

const getFollowingFeed = async (page = 1) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/feed?page=${page}&limit=10`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Feed fetch failed');
    return await response.json(); // { articles, total, page, hasMore }
  } catch (error) {
    console.error('Error fetching feed:', error);
    return null;
  }
};

const getUserProfile = async (userId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/profile/${userId}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Profile fetch failed');
    return await response.json(); // { profile, articles }
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

const getFollowers = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/followers`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Followers fetch failed');
    return await response.json();
  } catch (error) {
    console.error('Error fetching followers:', error);
    return null;
  }
};

const getFollowing = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/following`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Following fetch failed');
    return await response.json();
  } catch (error) {
    console.error('Error fetching following:', error);
    return null;
  }
};

export {
  Login, Register, checkLogin, PostArticle, imageUpload,
  handleLogout, deleteArticle,
  toggleFollow, getFollowingFeed, getUserProfile, getFollowers, getFollowing // ← add these
};