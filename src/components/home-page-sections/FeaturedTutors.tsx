
const tutors = [
  { name: 'Sarah M.', subject: 'Mathematics', rating: 4.9, reviews: 127, price: 28, avatar: '/avatars/sarah.jpg' },
  { name: 'Rahim K.', subject: 'English & IELTS', rating: 5.0, reviews: 89, price: 22, avatar: '/avatars/rahim.jpg' },
  // ... more
]

export function FeaturedTutors() {
  return (
    <section className="bg-muted/40 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Featured Tutors</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tutors.map((tutor) => (
            <div key={tutor.name} className="bg-card rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition">
              <div className="aspect-4/3 bg-muted relative">
                {/* <Image src={tutor.avatar} alt={tutor.name} fill className="object-cover" /> */}
              </div>
              <div className="p-5">
                <h3 className="font-semibold">{tutor.name}</h3>
                <p className="text-sm text-muted-foreground">{tutor.subject}</p>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span className="text-yellow-500">★</span>
                  <span>{tutor.rating}</span>
                  <span className="text-muted-foreground">({tutor.reviews})</span>
                </div>
                <div className="mt-4 font-medium">${tutor.price}/hr</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}