import { createContext,useState,useEffect } from "react";
import React from 'react';
import studyImg from '../assets/college_library_study_1769178240541.png';
import eventImg from '../assets/campus_event_students_1769178261694.png';
import codingImg from '../assets/student_laptop_coding_1769178282319.png';
import { checkLogin } from "../services/BackendHandler";
import { useSearchParams } from "react-router-dom";
const BACKEND_URL=import.meta.env.VITE_BACKEND_URL;
export const AppContext=createContext();
export function AppProvider({ children }) {
    const [searchParams]=useSearchParams();
    const q=searchParams.get('q')||'';
    const [sideBar,setSideBar]=useState(false);
    const [user,setUser]=useState(null);
    const [loading,setLoading]=useState(true);
    const [articles,setArticles]=useState([
        {
            _id: "6975126bb807e6712bca9022",
            title: "Mastering Final Exams: 5 Science-Backed Study Strategies",
            slug: "mastering-final-exams-5-science-backed-study-strategies",
            author: "696907eaf6098460fe274883",
            authorName: "Alex Rivera",
            content: [
                {
                    type: "paragraph",
                    data: { text: "How to optimize your brain for retention and focus during the most stressful week of the semester. From active recall to spaced repetition." }
                }
            ],
            coverImageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
            tags: ["study", "exams", "productivity", "academic", "strategies"],
            status: "published",
            readTime: 6,
            claps: 1400,
            datePublished: "2026-01-22T10:00:00.000Z",
            createdAt: "2026-01-22T10:00:00.000Z",
            updatedAt: "2026-01-22T10:00:00.000Z"
        },
        {
            _id: "6975050ac891fcba1507863c",
            title: "The Rise of Student Startups: Building the Next Unicorn from Your Dorm Room",
            slug: "rise-of-student-startups-building-next-unicorn-from-dorm-room",
            author: "696907eaf6098460fe274884",
            authorName: "Sarah Chen",
            content: [
                {
                    type: "paragraph",
                    data: { text: "Why some of the world's most successful tech companies started on college campuses and how you can do the same with minimal resources." }
                }
            ],
            coverImageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
            tags: ["startups", "entrepreneurship", "business", "innovation", "tech"],
            status: "published",
            readTime: 8,
            claps: 2100,
            datePublished: "2026-01-20T14:30:00.000Z",
            createdAt: "2026-01-20T14:30:00.000Z",
            updatedAt: "2026-01-20T14:30:00.000Z"
        },
        {
            _id: "69750421de02c60f0ba1c1c9",
            title: "Networking 101: How to Build Professional Connections Before Graduation",
            slug: "networking-101-build-professional-connections-before-graduation",
            author: "696907eaf6098460fe274885",
            authorName: "Jordan Smith",
            content: [
                {
                    type: "paragraph",
                    data: { text: "College isn't just about the degree; it's about the people you meet. Here's how to navigate campus events and LinkedIn effectively." }
                }
            ],
            coverImageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80",
            tags: ["networking", "career", "professional", "linkedin", "campus"],
            status: "published",
            readTime: 5,
            claps: 856,
            datePublished: "2026-01-18T09:15:00.000Z",
            createdAt: "2026-01-18T09:15:00.000Z",
            updatedAt: "2026-01-18T09:15:00.000Z"
        },
        {
            _id: "69750422de02c60f0ba1c1ca",
            title: "Beyond the Script: Architecting Scalable Full-Stack Content Delivery Systems",
            slug: "beyond-script-architecting-scalable-fullstack-content-delivery",
            author: "696907eaf6098460fe274883",
            authorName: "Alex Rivera",
            content: [
                {
                    type: "heading",
                    data: { text: "Introduction to Modern Architecture", level: 2 }
                },
                {
                    type: "paragraph",
                    data: { text: "Exploring cloud-native applications and scalable systems for the modern web." }
                }
            ],
            coverImageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
            tags: ["platform", "cloud", "fullstack", "architecture", "scalability"],
            status: "published",
            readTime: 10,
            claps: 3200,
            datePublished: "2026-01-24T18:41:47.336Z",
            createdAt: "2026-01-24T18:41:47.336Z",
            updatedAt: "2026-01-24T18:41:47.336Z"
        },
        {
            _id: "69750423de02c60f0ba1c1cb",
            title: "Technical Specification: Minimalist Document Generation with Modern Tools",
            slug: "technical-specification-minimalist-document-generation",
            author: "696907eaf6098460fe274884",
            authorName: "Sarah Chen",
            content: [
                {
                    type: "paragraph",
                    data: { text: "A comprehensive guide to creating beautiful, minimalist documentation using modern web technologies." }
                },
                {
                    type: "code",
                    data: { code: "const doc = new Document();", language: "javascript" }
                }
            ],
            coverImageUrl: "https://res.cloudinary.com/dugieu0qi/image/upload/v1769276422/article_images/ewn93x8udzumkf5r77h9.png",
            tags: ["documentation", "technical", "html", "design", "minimalist"],
            status: "published",
            readTime: 7,
            claps: 1520,
            datePublished: "2026-01-24T17:44:42.846Z",
            createdAt: "2026-01-24T17:44:42.846Z",
            updatedAt: "2026-01-24T17:44:42.846Z"
        }
    ]);    
    useEffect(()=>{
        const fetchUser=async()=>{
        setLoading(true);
        const loggedInUser=await checkLogin();
        if (loggedInUser){
            setUser(loggedInUser);
        } else{
            setUser(null);
        }
        setLoading(false);
    }
    fetchUser();
    },[]);
        useEffect(()=>{
            const fetchArticles = async()=>{
                setLoading(true);
                const res=await fetch(`${BACKEND_URL}/api/article/search?q=${q}`,{credentials:'include'})
                const data=await res.json();
                setArticles(data.articles);
                setLoading(false);
            };
            if(q){
            fetchArticles();}
        },[q]);
    return (
        <AppContext.Provider value={{sideBar,setSideBar,user,loading,setUser,setLoading,articles,setArticles}}>{children}</AppContext.Provider>
    )
}
