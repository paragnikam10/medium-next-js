

export default function Topics() {
    const topics = [
        'Data Science',
        'Self Improvement',
        'Writing',
        'Relationships',
        'Politics',
    
    ];

    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Recommended topics</h2>
            <div className="grid grid-cols-2 gap-4">
                {topics.map((topic, index) => (
                    <div key={index} className="px-4 py-2 bg-gray-100 text-center rounded-full text-sm text-gray-800 font-medium">
                        {topic}
                    </div>
                ))}
            </div>
        </div>
    )

}