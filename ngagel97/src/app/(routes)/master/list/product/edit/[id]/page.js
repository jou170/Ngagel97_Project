export default async function Page({ params }) {
    const slug = (await params).id
    console.log('====================================');
    console.log(slug);
    console.log('====================================');
    return <div>My Post: {slug}</div>
  }