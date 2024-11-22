import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, TextInput } from 'react-native';
import { collection, getDocs, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const postsCollection = collection(db, 'blogPosts');
      const snapshot = await getDocs(postsCollection);
      const postsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        comments: doc.data().comments || [],
      }));
      setPosts(postsList);
    } catch (error) {
      console.error("Error fetching blog posts: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = async () => {
    if (!newPost.title || !newPost.content) {
      alert("Please fill in the title and content.");
      return;
    }

    const postToAdd = {
      title: newPost.title,
      content: newPost.content,
      comments: [],
      timestamp: Timestamp.fromDate(new Date()),
    };

    try {
      await addDoc(collection(db, 'blogPosts'), postToAdd);
      setNewPost({ title: '', content: '' });
      setModalVisible(false);
      fetchPosts();
    } catch (error) {
      console.error("Error adding new post: ", error);
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment) return;

    const updatedPosts = [...posts];
    const postIndex = updatedPosts.findIndex(post => post.id === postId);

    if (postIndex < 0) return;

    const updatedPost = {
      ...updatedPosts[postIndex],
      comments: [...updatedPosts[postIndex].comments, newComment],
    };

    try {
      const postRef = doc(db, 'blogPosts', postId);
      await updateDoc(postRef, { comments: updatedPost.comments });
      updatedPosts[postIndex] = updatedPost;
      setPosts(updatedPosts);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  const toggleExpandPost = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading blog posts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Blog</Text>
      <ScrollView>
        {posts.map((post) => (
          <View key={post.id} style={styles.postContainer}>
            <View style={styles.postContent}>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postExcerpt}>
                {expandedPostId === post.id ? post.content : `${post.content.slice(0, 100)}...`}
              </Text>
              <TouchableOpacity style={styles.readMoreButton} onPress={() => toggleExpandPost(post.id)}>
                <Text style={styles.readMoreText}>
                  {expandedPostId === post.id ? 'Show Less' : 'Read More'}
                </Text>
              </TouchableOpacity>
              {expandedPostId === post.id && (
                <View style={styles.commentSection}>
                  <Text style={styles.commentHeader}>Comments</Text>
                  {post.comments.map((comment, index) => (
                    <Text key={index} style={styles.commentText}>{`> ${comment}`}</Text>
                  ))}
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Add a comment"
                    value={newComment}
                    onChangeText={setNewComment}
                  />
                  <TouchableOpacity style={styles.addCommentButton} onPress={() => handleAddComment(post.id)}>
                    <Text style={styles.addCommentText}>Post Comment</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add New Post</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Blog Post</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newPost.title}
              onChangeText={(text) => setNewPost({ ...newPost, title: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Content"
              value={newPost.content}
              onChangeText={(text) => setNewPost({ ...newPost, content: text })}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddPost}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,backgroundColor: "#FFE5D9", paddingHorizontal: 10 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#333', textAlign: 'center', marginVertical: 20 },
  postContainer: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 3 }, shadowRadius: 5, elevation: 3 },
  postContent: { flex: 1, justifyContent: 'center' },
  postTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  postExcerpt: { fontSize: 14, color: '#666', marginVertical: 5 },
  readMoreButton: { marginTop: 10 },
  readMoreText: { color: '#007AFF', fontSize: 16 },
  addButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginVertical: 20 },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 },
  modalTitle: { fontSize: 18, marginBottom: 15, fontWeight: 'bold' },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 15, paddingHorizontal: 10, borderRadius: 5 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  saveButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 5 },
  saveButtonText: { color: 'white' },
  cancelButton: { backgroundColor: '#f44336', padding: 10, borderRadius: 5 },
  cancelButtonText: { color: 'white' },
  commentSection: { paddingTop: 10, borderTopWidth: 1, borderTopColor: '#ccc', marginTop: 10 },
  commentHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  commentText: { fontSize: 14, color: '#333', marginVertical: 2 },
  commentInput: { height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginVertical: 10 },
  addCommentButton: { backgroundColor: '#007AFF', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5, alignSelf: 'flex-start' },
  addCommentText: { color: '#fff', fontWeight: 'bold' },
});

