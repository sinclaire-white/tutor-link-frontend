// components/sections/PopularCategories.tsx
const categories = [
  { name: 'Mathematics', count: 124, icon: '√' },
  { name: 'Physics', count: 87, icon: '⚛' },
  { name: 'English', count: 156, icon: '🗣' },
  { name: 'Programming', count: 98, icon: '</>' },
  { name: 'IELTS / TOEFL', count: 65, icon: '✈' },
  { name: 'Chemistry', count: 72, icon: '🧪' },
]

export function Categories() {
  return (
    <section>
      <h2 className="text-3xl font-bold text-center mb-10"> Subjects</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="group bg-card hover:bg-primary/10 border rounded-xl p-6 text-center transition-colors"
          >
            <div className="text-4xl mb-3">{cat.icon}</div>
            <h3 className="font-medium">{cat.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{cat.count} tutors</p>
          </div>
        ))}
      </div>
    </section>
  )
}