const BACKEND_URL=import.meta.env.VITE_BACKEND_URL;
const Login=async ({rollNoOrEmailValue,passwordValue}) => {
    
    try{
    const data={rollNoOrEmail:rollNoOrEmailValue,password:passwordValue};
    const response=await fetch(`${BACKEND_URL}/api/auth/login`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data),
        credentials:"include"
    });
    const result=await response.json();
    console.log(result);
    return {rollNo:result.rollNo,email:result.email,name:result.name};
}catch(error){
    console.error("Error during login:",error);
}
}
const Register=async ({emailValue,rollNoValue,passwordValue,nameValue}) => {
    try{
        const data={email:emailValue,rollNo:rollNoValue,password:passwordValue,name:nameValue};
        const response=await fetch(`${BACKEND_URL}/api/auth/register`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data),
            credentials:"include"
        });
        const result=await response.json();
        console.log(result);
    }
    catch(error){
        console.error("Error during registration:",error);
    }
}
const checkLogin=async ()=>{
    try{
        const response=await fetch(`${BACKEND_URL}/api/auth/checkLogin`,{
            method:"GET",
            credentials:"include"
        });
        if (response.ok){
            const result=await response.json();
            console.log("User is logged in");

            return result;
        }
        else{
            console.log("User is not logged in");
            return null;
        }
    }
    catch(error){
        console.error("Error during login check:",error);
        return null;
    }
}
const PostArticle = async ({data}) => {
    try {
      const articleData={title:data.title,content:[{type:"paragraph",data:{text:data.story}}],coverImageUrl:data.uploadedImage,status:"published"};
      const response = await fetch(`${BACKEND_URL}/api/article/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
  const imageUpload=async({data})=>{
    try{
        const formData=new FormData();
        formData.append('image',data.file);
        const response=await fetch(`${BACKEND_URL}/api/article/upload-image`,{
            method:"POST",
            body:formData,
            credentials:"include"
        })
        const result=await response.json();
        if(!response.ok){
            throw new Error(result.message || "Image upload failed");
        }
        if(result.imageUrl){
            return result.imageUrl;
        }
        return null;
    }
    catch(error){
        console.error("Error uploading image:",error);
    }
  }
  const handleLogout=async ()=>{
    try{
      const response=await fetch(`${BACKEND_URL}/api/logout`,{
        method:'POST',
        credentials:'include',
      });
      if(response.ok){
        console.log("Logout confirmed");
        return true
      }
    }
    catch(error){
      console.error('Error:',error);
    }
  }
  
export {Login,Register,checkLogin,PostArticle,imageUpload,handleLogout};