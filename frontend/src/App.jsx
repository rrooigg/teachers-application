import { useEffect, useState } from 'react'
import api  from './api';
import './App.css'

function App() {
  const [ teachers, setTeachers ] = useState([]); // array of all teachers
  const [ name, setName ] = useState('');
  const [ department, setDepartment ] = useState('');

  // event->form submitting
  // addTeacher sends request to server & function awaits because it will use (success vaiable) to decide what to do next
  const handleSubmit = async (event) => {
    // browser submits an HTML form page is reloaded
    // event.preventDefault(); 

    // .trim() because it wants to check if it has something other than whitespaces
    if(name.trim() && department.trim()) {
      const success= await addTeacher(); // returns true/false as seen in the function below
      
      if(success) {
        setName('');
        setDepartment('');

      }
    }
  }

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
      alert('Teacher cannot be added', error);
      return false;
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
    </form>

    <div>
      <h3>Teacher's List</h3>
      { teachers.length === 0 ? (<p>No Teachers found!</p>) : (
        <ul>
          { teachers.map((teacher) => (
            <li key={teacher.id}>{teacher.name}- {teacher.department}</li>
          ))}
        </ul>
      )}
    </div>
   
    </>
  )
}

export default App
