import { useEffect, useState } from 'react'
import api  from './api';
import './App.css'

function App() {
  const [ teachers, setTeachers ] = useState([]); // array of all teachers
  const [ name, setName ] = useState('');
  const [ department, setDepartment ] = useState('');
  // id to remember which teacher is being edited
  const [ editingId, setEditingId ] = useState(null);

  // event->form submitting
  // addTeacher sends request to server & function awaits because it will use (success vaiable) to decide what to do next
  const handleSubmit = async (event) => {
    // browser submits an HTML form page is reloaded
    event.preventDefault(); 

    // .trim() because it wants to check if it has something other than whitespaces
    if(!name.trim() || !department.trim()) {
      return;

    }

    if(editingId !== null) {
      await updateTeacher();

    } else {
      const success= await addTeacher(); // returns true/false as seen in the function below
        
      if(success) {
        setName('');
        setDepartment('');

      }

    }

  };

  // fetch teachers from backend API 
  const fetchTeachers = async () => {
    try {
      const response = await api.get('/teachers');
      setTeachers(response.data);

    } catch(error) {
      console.log('Teachers cannot be fetched', error);

    }
  };

  // adds a teacher by sending teacher's name & department to the backend
  const addTeacher = async () => {
    try {
      const response = await api.post('/teachers', {
        name: name.trim(),
        department: department.trim()
      });
      
      // updates list of teachers
      setTeachers((currentTeachers) => [...currentTeachers, response.data]);
      return true;
      
    } catch(error) {
      alert('Teacher cannot be added');
      console.log(error);
      return false;

    }

  };

  // update a teacher
  const updateTeacher = async () => {
    try {
      const response = await api.put(`/teachers/${editingId}`, {
        name: name.trim(),
        department: department.trim()
      });
      setTeachers(currentTeachers => currentTeachers.map(teacher => teacher.id === editingId ? response.data : teacher));
      setEditingId(null);
      setName('');
      setDepartment('');          

    } catch (error) {
      console.log('Error updating teacher', error);
      alert('Teacher cannot be updated');

    }

  };

  // cancel button
  const cancelEditing = () => {
    setEditingId(null);
    setName('');
    setDepartment('');

  };

  // delete teacher
  const deleteTeacher = async (id) => {
    try {
      await api.delete(`/teachers/${id}`);
      setTeachers(teachers.filter(teacher => teacher.id !== id));

    } catch (error) {
      console.log("Error deleting teacher", error);

    }

  };

  // fetch teachers once(once becuase of empty []) on the first render(/changes)
  useEffect(() => {
    fetchTeachers();
  },[]);

  return (
    <>
    <form onSubmit={handleSubmit}>
      <input type="text" name='name' value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter teacher's name..."/>
      <input type="text" name='department' value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Enter teacher's department..."/>
      <button type='submit'>Add Teacher</button>

      { editingId !== null && (
        <>
          <button type='submit' onClick={updateTeacher}>Update Teacher</button>
          <button type='button' onClick={cancelEditing}>Cancel</button>
        </>
      )}
    </form>

    <div className='list'>
      <h3>Teacher's List</h3>
      { teachers.length === 0 ? (<p>No Teachers found!</p>) : (
        <ul>
          { teachers.map((teacher) => (
            <li key={teacher.id}>{teacher.name}- {teacher.department}
            <button onClick={() => {
              setEditingId(teacher.id);
              setName(teacher.name)
              setDepartment(teacher.department);
            }}>Edit</button>
            <button onClick={() => deleteTeacher(teacher.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
   
    </>
  )
}

export default App
