"use client"

import { getAvailablePropertyLocations, getPropertyData } from "@/app/actions"
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatMessage from "@/components/ChatMessage";
import { useRouter } from "next/navigation";
import { v4 } from "uuid";
import { QUESTIONS } from "@/lib/chatbot_questions";

type PropertyBasics = {
  id: number,
  title: string,
  price: number,
  location: string
}

type PropertyBasicsType = PropertyBasics[];

type Message = {
  id: string;
  text: string;
  isUser: boolean;
}

export default function Home() {
  const [properties, setProperties] = useState<string[]>([]);
  const [fetchedData, setFetchedData] = useState<PropertyBasicsType>([]);

  const [inputValue, setInputValue] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    let id = localStorage.getItem("sessionId");
    if (!id) {
      id = v4();
      localStorage.setItem("sessionId", id);
    }
    setSessionId(id);
  }, []);

  const router = useRouter();

  // call fetchProperties function as soon as all the responses are collected.
  useEffect(() => {
    console.log(responses);
    if (responses.length === 6) {
      fetchProperties();
    }
  }, [responses])

  // function to fetch properties based on all the filters that user has provided the chatbot
  async function fetchProperties() {
    let ids: number[] = []
    fetchedData.map(d => {
      ids.push(d.id);
    })

    let locations: string[] = [];
    let amenities: string[] = [];

    locations = responses[1].split("|");
    amenities = responses[5].split("|");

    const budget = parseInt(responses[0])

    const res = await getPropertyData({
      ids,
      budget,
      locations,
      numberOfBedrooms: parseInt(responses[2]),
      numberOfBathrooms: parseInt(responses[3]),
      size_sqft: parseInt(responses[4]),
      amenities,
      sessionId
    });

    localStorage.setItem("properties", JSON.stringify(res));

    await new Promise((resolve) => setTimeout(resolve, 1000));

    router.push('/properties');
  }

  // fetches the properties that in user's budget
  async function fetchPropertiesByPrice(budget: number) {
    try {
      const fetchedData: PropertyBasicsType = (await getAvailablePropertyLocations({ price: budget })).data;
      setFetchedData(fetchedData);
      const fetchedProperties: string[] = (await getAvailablePropertyLocations({ price: budget })).property_list;
      if (fetchedProperties && fetchedProperties.length > 0) {
        setProperties(fetchedProperties);
        return fetchedProperties;
      }
      return [];
    } catch (error) {
      console.error("Error fetching property data:", error);
      return [];
    }
  }

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: QUESTIONS[0].text,
      isUser: false,
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);

    if (responses.length === 0) {
      if (isNaN(parseInt(inputValue))) return;
      fetchPropertiesByPrice(parseInt(inputValue)).then((res) => {

        // if there is no available property in current budget
        if (!res || res.length === 0) {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text:
              "Sorry, I couldn’t find any properties within that budget. Try with a higher budget.",
            isUser: false,
          };
          setMessages((prev) => [...prev, botMessage]);

          setResponses([]);
          setSelectedOptions([]);
          setCurrentQuestionIndex(0);
          setInputValue("");
          return;
        }

        QUESTIONS[1].options = res
        const newResponses = [...responses, inputValue];
        setResponses(newResponses);
        setInputValue("");

        renderNextQuestion(newResponses);
      })

      return;
    }

    const newResponses = [...responses, inputValue];
    setResponses(newResponses);
    setInputValue("");
    renderNextQuestion(newResponses);
  }

  // function for multi select questions (location and amenities)
  const handleMultiSelectSubmit = () => {
    if (selectedOptions.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: selectedOptions.join(", "),
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);

    const newResponses = [...responses, selectedOptions.join("|")];
    setResponses(newResponses);
    setSelectedOptions([]);

    renderNextQuestion(newResponses);
  };

  function renderNextQuestion(newResponses: string[]) {
    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1;

      if (nextIndex < QUESTIONS.length) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: QUESTIONS[nextIndex].text,
          isUser: false,
        };
        setMessages((prev) => [...prev, botMessage]);
        setCurrentQuestionIndex(nextIndex);
      } else {
        const summaryMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Thank you! Redirecting you to property listings...",
          isUser: false,
        };
        setMessages((prev) => [...prev, summaryMessage]);
      }
    }, 200);
  };

  // enables user to send message by pressing enter on keyboard
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleOption = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-4">
        <h1 className="text-xl font-semibold text-foreground">Agent Mira Chat Assistant</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              isUser={message.isUser}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-border bg-card px-6 py-4">
        <div className="max-w-3xl mx-auto">
          {QUESTIONS[currentQuestionIndex]?.type === "select" ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {QUESTIONS[currentQuestionIndex].options?.map((option) => (
                  <Button
                    key={option}
                    onClick={() => toggleOption(option)}
                    variant={selectedOptions.includes(option) ? "default" : "outline"}
                    className="transition-all"
                  >
                    {option}
                  </Button>
                ))}
              </div>
              <Button
                onClick={handleMultiSelectSubmit}
                disabled={selectedOptions.length === 0}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Select {currentQuestionIndex === 1 ? "Location" : "Amenities"} ({selectedOptions.length})
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-[hsl(var(--chat-input-bg))] border-border shadow-(--shadow-input) focus-visible:ring-primary"
              />
              <Button
                onClick={handleSend}
                size="icon"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-(--shadow-input) transition-all hover:scale-105"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
