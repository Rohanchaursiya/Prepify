// src/data/syllabusData.js

export const operatingSystemsSyllabus = {
  subject: "Operating Systems",
  units: [
    {
      id: "UNIT I",
      title: "Operating Systems Overview and System Structures",
      topics: [
        {
          name: "Operating Systems Overview",
          subTopics: [
            "Operating system functions", "Operating system structure", "Operating systems operations", "Computing environments", "Open-Source Operating Systems"
          ],
        },
        {
          name: "System Structures",
          subTopics: [
            "Operating System Services", "User and Operating-System Interface", "systems calls", "Types of System Calls", "system programs", "operating system structure", "operating system debugging", "System Boot"
          ],
        },
      ],
    },
    {
      id: "UNIT II",
      title: "Process Management",
      topics: [
        { name: "Process Concept", subTopics: ["Process scheduling", "Operations on processes", "Inter-process communication", "Communication in client server systems"] },
        { name: "Multithreaded Programming", subTopics: ["Multithreading models", "Thread libraries", "Threading issues"] },
        { name: "Process Scheduling", subTopics: ["Basic concepts", "Scheduling criteria", "Scheduling algorithms", "Multiple processor scheduling", "Thread scheduling"] },
        { name: "Inter-process Communication", subTopics: ["Race conditions", "Critical Regions", "Mutual exclusion with busy waiting", "Sleep and wakeup", "Semaphores", "Mutexes", "Monitors", "Message passing", "Barriers", "Classical IPC Problems - Dining philosophers problem, Readers and writers problem"] },
      ],
    },
    {
      id: "UNIT III",
      title: "Memory Management",
      topics: [
        { name: "Memory-Management Strategies", subTopics: ["Introduction", "Swapping", "Contiguous memory allocation", "Paging", "Segmentation"] },
        { name: "Virtual Memory Management", subTopics: ["Introduction", "Demand paging", "Copy on-write", "Page replacement", "Frame allocation", "Thrashing", "Memory-mapped files", "Kernel memory allocation"] },
      ],
    },
    {
      id: "UNIT IV",
      title: "Storage Management",
      topics: [
        { name: "Deadlocks", subTopics: ["Resources", "Conditions for resource deadlocks", "Ostrich algorithm", "Deadlock detection and recovery", "Deadlock avoidance", "Deadlock prevention"] },
        { name: "File Systems", subTopics: ["Files", "Directories", "File system implementation", "management and optimization"] },
        { name: "Secondary Storage Structure", subTopics: ["Overview of disk structure and attachment", "Disk scheduling", "RAID structure", "Stable-storage implementation"] },
      ],
    },
    {
      id: "UNIT V",
      title: "Protection and Security",
      topics: [
        { name: "System Protection", subTopics: ["Goals of protection", "Principles and domain of protection", "Access matrix", "Access control", "Revocation of access rights"] },
        { name: "System Security", subTopics: ["Introduction", "Program threats", "System and network threats", "Cryptography for security", "User authentication", "Implementing security defenses", "Firewalling to protect systems and networks", "Computer security classification"] },
      ],
    },
  ],
};