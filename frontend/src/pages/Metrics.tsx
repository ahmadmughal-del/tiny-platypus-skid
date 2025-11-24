"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Metrics = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4">
      <div className="container mx-auto max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Success Metrics</h1>
          <Link to="/" className="text-blue-600 hover:underline dark:text-blue-400">
            Back to Home
          </Link>
        </div>
        <Separator className="mb-6" />

        <Card>
          <CardHeader>
            <CardTitle>Activation & Engagement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>● Sprint Completion Rate: <strong>78%</strong></p>
            <p>● Time-to-Value: <strong>12 minutes</strong></p>
            <p>● Feature Adoption Rate: <strong>62%</strong></p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Conversion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>● Artefact-to-Trial Conversion Rate: <strong>25%</strong></p>
            <p>● Trial-to-Paid Conversion Rate: <strong>45%</strong></p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Retention & Growth</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>● Repeat Sprint Rate: <strong>60%</strong></p>
            <p>● Active User Engagement (WAU): <strong>2,500</strong></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Metrics;