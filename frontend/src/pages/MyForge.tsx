"use client";

import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, CalendarDays } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Report {
  id: string;
  title: string;
  date: string;
  summary: string;
}

const fetchReports = async (): Promise<Report[]> => {
  const { data } = await api.get("/reports");
  return data;
};

const MyForge = () => {
  const { data: reports, isLoading, isError } = useQuery({
    queryKey: ["reports"],
    queryFn: fetchReports,
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4">
      <div className="container mx-auto max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Forge (Cognitive Fingerprint)</h1>
          <Link to="/workspace" className="text-blue-600 hover:underline dark:text-blue-400">
            Back to Workspace
          </Link>
        </div>
        <Separator className="mb-6" />

        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          A history of your strategic sprints and forged insights.
        </p>

        <div className="grid gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))
          ) : isError ? (
            <p className="text-center text-red-500 dark:text-red-400">
              Error fetching reports. Please try again later.
            </p>
          ) : reports && reports.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 italic">
              No reports found. Start a new Strategic Sprint to see your progress here!
            </p>
          ) : (
            reports?.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <FileText className="h-5 w-5 text-primary" />
                    {report.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <CalendarDays className="h-4 w-4" />
                    {report.date}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">{report.summary}</p>
                  <Link to={`/my-forge/${report.id}`} className="text-blue-600 hover:underline dark:text-blue-400 text-sm block mt-2">
                    View Details
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyForge;