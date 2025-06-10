import BirthdayForm from "./components/AddBirthdayForm"
import BirthdayList from "./components/BirthdayList"

function App() {

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">🎉 PingWish - Birthday Reminder</h1>
      <BirthdayForm />
      <BirthdayList />
    </div>
  )
}

export default App