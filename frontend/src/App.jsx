import { useEffect, useState } from 'react'
import api  from './api';
import './App.css'

function App() {
  const [ teachers, setTeachers ] = useState([]);
  const [ name, setName ] = useState('');
  const [ department, setDepartment ] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if(name.trim() && department.trim()) {
      const success= await addTeacher();
      
      if(success) {
        setName('');
        setDepartment('');

      }
    }
  }

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/teachers');
      setTeachers(response.data);

    } catch(error) {
      console.log('Teachers cannot be fetched', error);

    }
  };

  const addTeacher = async () => {
    try {
      const response = await api.post('/teachers', {
        name: name.trim(),
        department: department.trim()
      });
      setTeachers((currentTeachers) => [...currentTeachers, response.data]);
      return true;

    } catch(error) {
      alert('Teacher cannot be added', error);
      return false;
    }

  };

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
