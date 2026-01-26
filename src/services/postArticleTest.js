const PostArticle = async () => {
    const articleData = {
        "title": "Exploring Node.js and Backend Development Techniques",
        "content": [
          {
            "type": "heading",
            "data": { "text": "Introduction to Node.js" }
          },
          {
            "type": "paragraph",
            "data": { "text": "Node.js is a powerful JavaScript runtime that allows developers to build scalable backend applications. It uses an event-driven, non-blocking I/O model that makes it lightweight and efficient." }
          },
          {
            "type": "paragraph",
            "data": { "text": "In this article, we will explore how to structure backend projects, handle REST APIs, and interact with databases like MongoDB." }
          },
          {
            "type": "heading",
            "data": { "text": "Project Setup" }
          },
          {
            "type": "paragraph",
            "data": { "text": "To start a Node.js project, use npm init and install required dependencies. Organize your folders for controllers, models, and routes to maintain clean code." }
          },
          {
            "type": "paragraph",
            "data": { "text": "Implement authentication and authorization for your APIs to secure sensitive endpoints." }
          },
          {
            "type": "heading",
            "data": { "text": "Automated Tag Generation" }
          },
          {
            "type": "paragraph",
            "data": { "text": "Tags can be automatically generated using TF-IDF and RAKE algorithms. We normalize them, remove duplicates, and limit to the top 5 tags per article." }
          },
          {
            "type": "paragraph",
            "data": { "text": "Testing with multiple headings and paragraphs ensures your tag generator picks meaningful keywords." }
          }
        ],
        "coverImageUrl": null,
        "tags": [],
        "status": "published"
      }
      
      
      
    try {
      const response = await fetch("http://localhost:3101/api/article/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ send JWT cookie
        body: JSON.stringify(articleData)
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
    }
  };
  PostArticle();