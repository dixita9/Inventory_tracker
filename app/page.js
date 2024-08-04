'use client'
import Image from "next/image";
import {useState, useEffect} from 'react';
import {firestore} from '@/firebase'
import {Box, Stack, TextField, Typography, Modal, Button, Close} from '@mui/material';
import { addDoc, deleteDoc, where, query, collection, getDocs, doc, getDoc, setDoc} from "firebase/firestore";
import SearchIcon from '@mui/icons-material/Search';


export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchItem, setSearchItems] = useState([]);
  const [isSearching, setIsSearching] = useState (false)

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })  
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore,'inventory'), item)
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()){
      const {quantity} = docSnap.data()
        await setDoc(docRef,{quantity: quantity + 1})
      } else{
        await setDoc(docRef,  {quantity: 1})
      }

    if(isSearching){
      searchItems(searchQuery)
    } else {
      await updateInventory()
    }
  } 

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore,'inventory'), item)
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()){
      const {quantity} = docSnap.data()

      if (quantity == 1){
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef,{quantity: quantity - 1})
      }

    }
    if(isSearching){
      searchItems(searchQuery)
    } else {
      await updateInventory()
    }
  } 

  

  const searchItems = async (queryStr) => {
    try {
      console.log("Search Query String:", queryStr);
  
      // Fetch all documents in the collection
      const snapshot = await getDocs(collection(firestore, 'inventory'));
      const searchResults = [];
      setIsSearching(true);
      // Filter documents by matching document ID
      snapshot.forEach((doc) => {
        const docId = doc.id;
        if (docId.toLowerCase().includes(queryStr.toLowerCase())) {
          searchResults.push({
            name: docId,
            ...doc.data(),
          });
        }
      });
  
      console.log("Search Results:", searchResults);
      setInventory(searchResults);
    } catch (error) {
      console.error("Error searching items:", error);
    }
  };

  const backButton = async () =>{
    updateInventory()
    setIsSearching(false); 
    setSearchQuery("")
  }
  

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
      
      <Box width = "100vw"
      height = "100vh"
      display= "flex"
      justifyContent= "center"
      flexDirection= "column"
      alignItems= "center"
      gap = {2}
      >
        
      <Modal open = {open} onClose = {handleClose}>
        <Box 
        position= "absolute"
        top = "50%"
        left = "50%"
        width = {400}
        bgcolor= "#fff"
        border = "2px solid #000"
        boxShadow = {24}
        p ={4}
        display = "flex"
        flexDirection= "column"
        gap = {3}
        sx = {{
        transform: "translate(-50%, -50%)"
        }}
        >
        <Typography variant="h6"> Add Item </Typography>
        <Stack width = "100%" direction = "row" spacing  = {2}>
        <TextField
          variant = 'outlined'
          fullWidth
          value = {itemName}
          onChange = {(e) => {
            setItemName(e.target.value)
            
          }
        }     
        />
        <Button variant = "outlined"
        onClick = {() =>{
          addItem(itemName)
          setItemName('')
          handleClose()
        }}
        > Add </Button>
        </Stack>
        </Box>
      </Modal>
      
      <Box border = "1px solid #333">
        <Box width = "800px" display = "flex" height = "100px" bgcolor="#FF7F3E" alignItems= "center" justifyContent= "space-between" padding="0 16px">
          <Stack direction = "row" spacing = {2} >
          {isSearching && searchQuery && (<Button  variant = "outlined" sx={{ color: '#604CC3', height: '40px', top: '10px', borderColor: '#604CC3', '&:hover': { borderColor: '#604CC3', backgroundColor: 'rgba(0, 0, 0, 0.04)'}}}  onClick = {() =>{backButton() }}> Back </Button>)}
          <Typography variant = 'h2' color = "#fff" sx={{ position: 'absolute', left: '50%', top: '11%' , transform: 'translateX(-50%)'}}> Inventory Items </Typography> 
          </Stack>
          
        </Box>
        <Box display="flex" height = "100px" justifyContent="space-between" alignItems="center"  width = "780px" margin="0 auto">
          <SearchIcon sx={{ color: '#604CC3', fontSize: 35, marginRight: 1, marginLeft:1}}/>
          <TextField variant="outlined" placeholder="Search Items" size = "small" sx={{ flexGrow: 1, marginRight: 2}} value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              console.log("Updated Search Query:", e.target.value); // Debugging line
            }}  />
          <Stack  direction = "row" spacing = {2} >
            <Button variant = "contained" onClick ={() => {
              searchItems(searchQuery);
              console.log(inventory)
              console.log("Search Query on Button Click:", searchQuery); // Debugging line
            }}> Search </Button>
            <Button variant = "contained" onClick ={() => {
              handleOpen()
            }}> Add New Item </Button>
          </Stack>
      </Box>
        <Stack width = "800px" height = "300px" spacing = {2} overflow = "auto" >
          {inventory.map(({name, quantity}) => (
              <Box key = {name} width = "100%" height= "10px" display = "flex" alignItems = "center" justifyContent="space-between" bgcolor="#FFF6E9" padding={4}>
              <Typography variant = 'h5' color = '#000' textAlign='center'> {name.charAt(0).toUpperCase() + name.slice(1)} </Typography>
              <Typography variant = 'h5'color = '#000' textAlign='center'> {quantity} </Typography>
              <Stack direction = "row" spacing = {2}>
              <Button variant = "contained" onClick = {() => {
                addItem(name)
              }}> Add </Button>
              <Button variant = "contained" onClick = {() => {
                removeItem(name)
              }}> Remove</Button></Stack>
              </Box>
              
              
            ))}

        </Stack>
        </Box>
      </Box>

  )
}





// {inventory.forEach((item) => {
//   return (
//     <>
//     {item.name}
//     {item.count}
    
//     </>
//   )
// }

// )}


   {/* <Typography variant = 'h1'>
        Inventory Management
      </Typography> */}