"use client";

import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, CalendarDays, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Report {
  id: string;
  title: string;
  date: string;
  summary: string;
  full_content?: string; // Assuming the full content might be available
}

const fetchReportDetail = async (reportId: string): Promise<Report> => {
  const { data } = await api.get(`/reports/${reportId}`);
  return data;
};

const ReportDetail = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const { data: report, isLoading, isError } = useQuery({
    queryKey: ["reportDetail", reportId],
    queryFn: () => fetchReportDetail(reportId!),
    enabled: !!reportId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <div className="container mx-auto max-w-3xl">
          <Skeleton className="h-8 w-1/4 mb-6" />
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-24 w-full mt-6" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Report Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The report you are looking for does not exist or an error occurred.
            </p>
            <Link to="/my-forge">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to My Forge
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center mb-6">
          <Link to="/my-forge">
            <Button variant="ghost" className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Report Details</h1>
        </div>
        <Separator className="mb-6" />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <FileText className="h-6 w-6 text-primary" />
              {report.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="flex items-center gap-2 text-base text-gray-500 dark:text-gray-400">
              <CalendarDays className="h-5 w-5" />
              {report.date}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300">{report.summary}</p>
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
              <h3 className="font-semibold text-lg mb-2">Full Report Content</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {report.full_content || "Full content not available."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportDetail;