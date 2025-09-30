
// A single sample PDF for demonstration purposes.
const samplePdfUrl = 'https://drive.google.com/file/d/1MCHK2uif5hiptlESsN6Ta6XQvYY3tEuS/view?usp=sharing';

export const data = {
  physics: {
    title: 'Physics Cycle',
    subjects: [
      { 
        id: 'maths_1', name: 'Engineering Mathematics', icon: '📐',
        textbook: [
          { id: 'maths_tb_1', title: 'Mathematics 1', url:samplePdfUrl },
          { id: 'maths_tb_2', title: 'Mathematics 2', url: samplePdfUrl },
        ],
        notes: [
          { id: 'maths_notes_1', title: 'Module 1: Differential Calculus Notes', url: samplePdfUrl },
        ],
        pyqs: [
          { id: 'maths_pyq_2023', title: 'Question Paper - 2023', url: samplePdfUrl },
        ]
      },
      { 
        id: 'physics_eng', name: 'Engineering Physics', icon: '⚛️',
        textbook: [{ id: 'phy_tb_1', title: 'Concepts of Modern Physics', url: samplePdfUrl }],
        notes: [{ id: 'phy_notes_1', title: 'Module 1: Quantum Mechanics Notes', url: samplePdfUrl }],
        pyqs: [
            { id: 'phy_pyq_2023', title: 'Question Paper - 2023', url: samplePdfUrl },
            { id: 'phy_pyq_2022', title: 'Question Paper - 2022', url: samplePdfUrl }
        ]
      },
       { id: 'mech_eng', name: 'Elective1- Mechanical Engineering', icon: '⚙️', textbook: [], notes: [], pyqs: [] },
       { id: 'ele_eng', name: 'Elements of Electrical Engineering', icon: '⚡', textbook: [], notes: [], pyqs: [] },
       { id: 'c_prog', name: 'Elective2- Introduction to Programming', icon: '💻', textbook: [], notes: [], pyqs: [] },
       { id: 'idt', name: 'Innovation & Design thinking', icon: '💡', textbook: [], notes: [], pyqs: [] }
    ]
  },
  chemistry: {
    title: 'Chemistry Cycle',
    subjects: [
      { 
        id: 'chem_eng', name: 'Engineering Chemistry', icon: '⚗️',
        textbook: [{ id: 'chem_tb_1', title: 'Organic Chemistry by Paula Yurkanis Bruice', url: samplePdfUrl }],
        notes: [],
        pyqs: [{ id: 'chem_pyq_2023', title: 'Question Paper - 2023', url: samplePdfUrl }]
      },
       { id: 'maths_2', name: 'Engineering Mathematics', icon: '📐', textbook: [], notes: [], pyqs: [] },
       { id: 'mechanics', name: 'Engineering Mechanics', icon: '🔧', textbook: [], notes: [], pyqs: [] },
       { id: 'elec_eng', name: 'Elective3- Electronics Engineering', icon: '🔌', textbook: [], notes: [], pyqs: [] },
       { id: 'egd', name: 'Engineering Graphics and Design', icon: '📏', textbook: [], notes: [], pyqs: [] },
       { id: 'sustainability', name: 'Elective3- Sustainability/Skill', icon: '🌱', textbook: [], notes: [], pyqs: [] },
       { id: 'comm_eng', name: 'Communication English', icon: '📝', textbook: [], notes: [], pyqs: [] }
    ]
  }
};
