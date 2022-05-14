import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Route } from "react-router-dom";

import { BiLike, BiDislike, BiShare, BiComment, BiCommentAdd } from "react-icons/bi";

import CommentForm from "../../components/CommentForm";
import EditComment from "../../components/EditComment";
import DeleteComment from "../../components/DeleteComment";

function Post() {
    let { postSlug } = useParams();
    const [post, setPost] = useState({ post: {} });
    const [postIsLoaded, setPostIsLoaded] = useState(false);

    const [comments, setComments] = useState({ comments: {} });

    const [isAuthor, setIsAuthor] = useState(false);

    // console.log("=====> POST SLUG");
    // console.log(postSlug);

    // Token de l'utilisateur
    const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
    const token = user.pass;
    const user_id = user.id;

    // Request options
    const url = `http://localhost:8080/api/articles/${postSlug}`;
    const urlComments = `http://localhost:8080/api/articles/${postSlug}/comments`;
    const reqOptions = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    const fetchDetails = () => {
        Promise.all([fetch(url, reqOptions), fetch(urlComments, reqOptions)])
            .then(([resPost, resComments]) => Promise.all([resPost.json(), resComments.json()]))
            .then(([dataPost, dataComments]) => {
                setPost(dataPost);
                setComments(dataComments);
                setPostIsLoaded(true);

                if (user_id === dataPost.articleFound.author_id) {
                    setIsAuthor(true);
                }
            });
    };

    useEffect(() => {
        fetchDetails();
    }, []);

    if (!postIsLoaded) {
        return (
            <div>
                <h1> Pleses wait some time.... </h1>
            </div>
        );
    }

    // if (user_id == post.articleFound.author_id) {
    //     setIsAuthor(true);
    // }

    // console.log("", post);

    // console.log("", isAuthor);

    return (
        <div className="post">
            <div className="post__container container">
                <div>
                    <div className="post__details">
                        <div className="post__header">
                            <h1 className="post__title">{post.articleFound.title}</h1>
                            <div className="post__header--author">
                                <div>
                                    {!post.articleFound.author_avatar ? (
                                        <div className="author__img initiales">
                                            <p>
                                                {`${post.articleFound.author_firstName} ${post.articleFound.author_lastName}
                                                `
                                                    .match(/\b\w/g)
                                                    .join("")
                                                    .toUpperCase()}
                                            </p>
                                        </div>
                                    ) : (
                                        <img
                                            className="author__img"
                                            src={post.articleFound.author_avatar}
                                            alt={"Photo de profile de " + post.articleFound.author_firstName}
                                        />
                                    )}
                                </div>

                                <div className="header__infos">
                                    <p className="author__name">
                                        {post.articleFound.author_firstName + " " + post.articleFound.author_lastName}
                                    </p>
                                    <div className="post__header--datetime">{post.articleFound.timestamp}</div>
                                </div>
                            </div>
                        </div>

                        {post.articleFound.img ? (
                            <div className="post__content">
                                <p>{post.articleFound.content}</p>
                                <img
                                    className="post__content--img"
                                    src={post.articleFound.img}
                                    alt={"image de l'article" + post.articleFound.title}
                                />
                            </div>
                        ) : (
                            <div className="post__content">
                                <p>{post.articleFound.content}</p>
                            </div>
                        )}

                        <div className="post__footer">
                            <p className="social">
                                <span className="social__icon">
                                    <BiLike />
                                </span>
                                <span className="social__count">{post.articleFound.likes}</span>
                            </p>
                            <p className="social">
                                <span className="social__icon">
                                    <BiDislike />
                                </span>
                                <span className="social__count"> {post.articleFound.dislikes}</span>
                            </p>
                            <p className="social">
                                <span className="social__icon">
                                    <BiShare />
                                </span>
                                <span className="social__count">{post.articleFound.shares}</span>
                            </p>
                            <p className="social">
                                <span className="social__icon">
                                    <BiComment />
                                </span>
                                <span className="social__count">{post.articleFound.comments}</span>
                            </p>

                            {!isAuthor ? null : (
                                <div className="post__settings">
                                    <button className="post_edit btn btn__edit">Editer</button>
                                    <button className="post_delete btn btn__delete">Supprimer</button>
                                </div>
                            )}

                            <button className="social__icon btn">
                                <BiCommentAdd />
                            </button>
                        </div>
                    </div>
                    <div className="comments">
                        <h3 className="comments__title">Commentaires</h3>

                        <CommentForm post_id={post.articleFound.id} />

                        {!comments.allComments
                            ? "Aucun commentaire, soyez le premier !"
                            : comments.allComments.map((comment) => (
                                  <div className="comments__post" key={comment.id}>
                                      <div className="comments__author">
                                          {/* {comment.author_id} */}

                                          {!comment.author_avatar ? (
                                              <div className="author__img initiales">
                                                  <p>
                                                      {`${comment.firstName} ${comment.lastName}
                                                `
                                                          .match(/\b\w/g)
                                                          .join("")
                                                          .toUpperCase()}
                                                  </p>
                                              </div>
                                          ) : (
                                              <img className="author__img" src={comment.avatar} />
                                          )}

                                          <div className="comments__author--fullName">
                                              <p>
                                                  {comment.firstName} {comment.lastName}
                                              </p>
                                          </div>
                                      </div>

                                      <div className="comments__timestamp">{comment.timestamp}</div>
                                      <div className="comments__content">{comment.comment}</div>

                                      <div className="comments__settings--btn">
                                          {/* <button className="comments__edit btn btn__edit">Edit</button> */}

                                          <EditComment
                                              author_id={comment.author_id}
                                              post_id={post.articleFound.id}
                                              comment_id={comment.id}
                                              comment_value={comment.comment}
                                          />

                                          <DeleteComment
                                              author_id={comment.author_id}
                                              post_id={post.articleFound.id}
                                              comment_id={comment.id}
                                          />
                                      </div>
                                  </div>
                              ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Post;
