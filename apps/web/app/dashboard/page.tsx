"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Input } from "@/components/atoms/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { ScrollArea } from "@/components/atoms/scroll-area";
import {
  Activity,
  Users,
  Server,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Download,
  RefreshCw,
  Globe,
  Database,
  Shield,
  Zap,
  UserCheck,
  UserX,
  Settings,
  Key,
} from "lucide-react";
import AppContainer from "@/components/layouts/app-container/app-container";

// Mock data for single workspace
const workspaceData = {
  workspace: {
    id: 1,
    name: "Engineering Team",
    slug: "engineering-team",
    createdAt: "2024-01-15T10:00:00Z",
    plan: "PRO",
    apiQuota: 100000,
    apiUsed: 45670,
  },

  members: [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@company.com",
      role: "ADMIN",
      status: "ACTIVE",
      lastActive: "2024-07-16T14:30:00Z",
      avatar: "/api/placeholder/32/32",
      joinedAt: "2024-01-15T10:00:00Z",
      apiCalls: 1245,
      permissions: ["READ", "WRITE", "DELETE", "ADMIN"],
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@company.com",
      role: "DEVELOPER",
      status: "ACTIVE",
      lastActive: "2024-07-16T13:15:00Z",
      avatar: "/api/placeholder/32/32",
      joinedAt: "2024-01-20T09:00:00Z",
      apiCalls: 892,
      permissions: ["READ", "WRITE"],
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol@company.com",
      role: "DEVELOPER",
      status: "INACTIVE",
      lastActive: "2024-07-14T16:45:00Z",
      avatar: "/api/placeholder/32/32",
      joinedAt: "2024-02-01T11:30:00Z",
      apiCalls: 234,
      permissions: ["READ", "WRITE"],
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david@company.com",
      role: "VIEWER",
      status: "ACTIVE",
      lastActive: "2024-07-16T15:20:00Z",
      avatar: "/api/placeholder/32/32",
      joinedAt: "2024-02-10T14:00:00Z",
      apiCalls: 156,
      permissions: ["READ"],
    },
  ],

  apiLogs: [
    {
      id: 1,
      timestamp: "2024-07-16T15:30:25Z",
      method: "GET",
      endpoint: "/api/v1/users",
      status: 200,
      responseTime: 145,
      userId: 1,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      ip: "192.168.1.100",
      size: 2048,
    },
    {
      id: 2,
      timestamp: "2024-07-16T15:29:18Z",
      method: "POST",
      endpoint: "/api/v1/projects",
      status: 201,
      responseTime: 289,
      userId: 2,
      userAgent: "PostmanRuntime/7.32.3",
      ip: "192.168.1.101",
      size: 1024,
    },
    {
      id: 3,
      timestamp: "2024-07-16T15:28:45Z",
      method: "PUT",
      endpoint: "/api/v1/tasks/123",
      status: 200,
      responseTime: 198,
      userId: 1,
      userAgent: "axios/1.4.0",
      ip: "192.168.1.100",
      size: 512,
    },
    {
      id: 4,
      timestamp: "2024-07-16T15:27:30Z",
      method: "DELETE",
      endpoint: "/api/v1/files/456",
      status: 204,
      responseTime: 95,
      userId: 2,
      userAgent: "curl/7.68.0",
      ip: "192.168.1.101",
      size: 0,
    },
    {
      id: 5,
      timestamp: "2024-07-16T15:26:12Z",
      method: "GET",
      endpoint: "/api/v1/analytics",
      status: 500,
      responseTime: 5000,
      userId: 3,
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      ip: "192.168.1.102",
      size: 256,
      error: "Internal Server Error",
    },
    {
      id: 6,
      timestamp: "2024-07-16T15:25:08Z",
      method: "GET",
      endpoint: "/api/v1/dashboard",
      status: 401,
      responseTime: 50,
      userId: null,
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
      ip: "192.168.1.103",
      size: 128,
      error: "Unauthorized",
    },
  ],

  systemMetrics: {
    uptime: "99.9%",
    avgResponseTime: 187,
    totalRequests: 45670,
    errorRate: 2.3,
    activeConnections: 234,
    memoryUsage: 78.5,
    cpuUsage: 45.2,
    diskUsage: 62.1,
  },

  recentActivity: [
    {
      id: 1,
      type: "MEMBER_JOINED",
      message: "David Wilson joined the workspace",
      timestamp: "2024-07-16T14:30:00Z",
      userId: 4,
      metadata: { role: "VIEWER" },
    },
    {
      id: 2,
      type: "API_KEY_CREATED",
      message: "New API key created by Alice Johnson",
      timestamp: "2024-07-16T13:15:00Z",
      userId: 1,
      metadata: { keyName: "production-key" },
    },
    {
      id: 3,
      type: "MEMBER_ROLE_UPDATED",
      message: "Bob Smith's role updated to DEVELOPER",
      timestamp: "2024-07-16T12:45:00Z",
      userId: 2,
      metadata: { oldRole: "VIEWER", newRole: "DEVELOPER" },
    },
    {
      id: 4,
      type: "API_LIMIT_WARNING",
      message: "API usage reached 80% of monthly limit",
      timestamp: "2024-07-16T11:30:00Z",
      userId: null,
      metadata: { usage: 80000, limit: 100000 },
    },
  ],
};

export default function DashboardPage() {
  const [logFilter, setLogFilter] = useState("all");
  const [memberFilter, setMemberFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Filtered API logs
  const filteredLogs = useMemo(() => {
    let logs = workspaceData.apiLogs;

    if (logFilter !== "all") {
      if (logFilter === "errors") {
        logs = logs.filter((log) => log.status >= 400);
      } else if (logFilter === "success") {
        logs = logs.filter((log) => log.status < 400);
      } else {
        logs = logs.filter((log) => log.method === logFilter);
      }
    }

    if (searchTerm) {
      logs = logs.filter(
        (log) =>
          log.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.ip.includes(searchTerm) ||
          log.userAgent.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return logs;
  }, [logFilter, searchTerm]);

  // Filtered members
  const filteredMembers = useMemo(() => {
    let members = workspaceData.members;

    if (memberFilter !== "all") {
      members = members.filter((member) =>
        memberFilter === "active"
          ? member.status === "ACTIVE"
          : member.status === "INACTIVE"
      );
    }

    if (searchTerm) {
      members = members.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return members;
  }, [memberFilter, searchTerm]);

  const getStatusColor = (status: any) => {
    if (status < 300) return "bg-green-100 text-green-800";
    if (status < 400) return "bg-blue-100 text-blue-800";
    if (status < 500) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-blue-100 text-blue-800";
      case "POST":
        return "bg-green-100 text-green-800";
      case "PUT":
        return "bg-orange-100 text-orange-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      case "DEVELOPER":
        return "bg-blue-100 text-blue-800";
      case "VIEWER":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getRelativeTime = (timestamp: string) => {
    const now: any = new Date();
    const time: any = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <AppContainer>
      <div className="flex flex-1 flex-col space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              {workspaceData.workspace.name}
            </h1>
            <p className="text-muted-foreground">
              Workspace monitoring and member management
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs, members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    API Usage
                  </p>
                  <p className="text-2xl font-bold ">
                    {(workspaceData.workspace.apiUsed / 1000).toFixed(1)}K
                  </p>
                </div>
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2">
                <div className="bg-gray-200 rounded-full h-[0.5rem]">
                  <div
                    className="bg-blue-600 h-[0.5rem] rounded-full"
                    style={{
                      width: `${(workspaceData.workspace.apiUsed / workspaceData.workspace.apiQuota) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {workspaceData.workspace.apiUsed} /{" "}
                  {workspaceData.workspace.apiQuota} calls
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Members
                  </p>
                  <p className="text-2xl font-bold ">
                    {
                      workspaceData.members.filter((m) => m.status === "ACTIVE")
                        .length
                    }
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {workspaceData.members.length} total members
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    System Uptime
                  </p>
                  <p className="text-2xl font-bold ">
                    {workspaceData.systemMetrics.uptime}
                  </p>
                </div>
                <Server className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Avg response: {workspaceData.systemMetrics.avgResponseTime}ms
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Error Rate
                  </p>
                  <p className="text-2xl font-bold ">
                    {workspaceData.systemMetrics.errorRate}%
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Last 24 hours</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="logs" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger className="cursor-pointer" value="logs">
              API Logs
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="members">
              Members
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="activity">
              Activity
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="system">
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>API Request Logs</CardTitle>
                    <CardDescription>
                      Real-time API activity monitoring
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select value={logFilter} onValueChange={setLogFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter logs" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Requests</SelectItem>
                        <SelectItem value="GET">GET Only</SelectItem>
                        <SelectItem value="POST">POST Only</SelectItem>
                        <SelectItem value="PUT">PUT Only</SelectItem>
                        <SelectItem value="DELETE">DELETE Only</SelectItem>
                        <SelectItem value="errors">Errors Only</SelectItem>
                        <SelectItem value="success">Success Only</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {filteredLogs.map((log) => {
                      const user = workspaceData.members.find(
                        (m) => m.id === log.userId
                      );
                      return (
                        <div
                          key={log.id}
                          className="border rounded-lg p-3 hover:bg-muted/50"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Badge className={getMethodColor(log.method)}>
                                {log.method}
                              </Badge>
                              <Badge className={getStatusColor(log.status)}>
                                {log.status}
                              </Badge>
                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                {log.endpoint}
                              </code>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Clock className="h-4 w-4" />
                              {getRelativeTime(log.timestamp)}
                            </div>
                          </div>
                          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">User:</span>
                              <span className="ml-2 font-medium">
                                {user ? user.name : "Anonymous"}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">
                                Response Time:
                              </span>
                              <span className="ml-2 font-medium">
                                {log.responseTime}ms
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">IP:</span>
                              <span className="ml-2 font-medium">{log.ip}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Size:</span>
                              <span className="ml-2 font-medium">
                                {log.size}B
                              </span>
                            </div>
                          </div>
                          {log.error && (
                            <div className="mt-2 text-sm text-red-500 bg-red-500/10 p-2 rounded">
                              Error: {log.error}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Workspace Members</CardTitle>
                    <CardDescription>
                      Manage team members and permissions
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={memberFilter}
                      onValueChange={setMemberFilter}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter members" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Members</SelectItem>
                        <SelectItem value="active">Active Only</SelectItem>
                        <SelectItem value="inactive">Inactive Only</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <UserCheck className="h-4 w-4 mr-2" />
                      Invite Member
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className="border rounded-lg p-4 hover:bg-muted/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold ">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {member.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getRoleColor(member.role)}>
                            {member.role}
                          </Badge>
                          <Badge
                            variant={
                              member.status === "ACTIVE"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {member.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Last Active:</span>
                          <span className="ml-2 font-medium">
                            {getRelativeTime(member.lastActive)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">API Calls:</span>
                          <span className="ml-2 font-medium">
                            {member.apiCalls}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Joined:</span>
                          <span className="ml-2 font-medium">
                            {new Date(member.joinedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Permissions:</span>
                          <span className="ml-2 font-medium">
                            {member.permissions.length}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {member.permissions.map((permission) => (
                          <Badge
                            key={permission}
                            variant="outline"
                            className="text-xs"
                          >
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Workspace events and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {workspaceData.recentActivity.map((activity) => {
                      const user = workspaceData.members.find(
                        (m) => m.id === activity.userId
                      );
                      return (
                        <div
                          key={activity.id}
                          className="border rounded-lg p-3 hover:bg-muted/50"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              {activity.type === "MEMBER_JOINED" && (
                                <UserCheck className="h-4 w-4 text-green-600" />
                              )}
                              {activity.type === "MEMBER_ROLE_UPDATED" && (
                                <Shield className="h-4 w-4 text-blue-600" />
                              )}
                              {activity.type === "API_KEY_CREATED" && (
                                <Key className="h-4 w-4 text-purple-600" />
                              )}
                              {activity.type === "API_LIMIT_WARNING" && (
                                <AlertTriangle className="h-4 w-4 text-orange-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium ">
                                {activity.message}
                              </p>
                              <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                <span>
                                  {getRelativeTime(activity.timestamp)}
                                </span>
                                {user && <span>by {user.name}</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                  <CardDescription>Real-time system metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span className="font-medium">
                        {workspaceData.systemMetrics.cpuUsage}%
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${workspaceData.systemMetrics.cpuUsage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span className="font-medium">
                        {workspaceData.systemMetrics.memoryUsage}%
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${workspaceData.systemMetrics.memoryUsage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Disk Usage</span>
                      <span className="font-medium">
                        {workspaceData.systemMetrics.diskUsage}%
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full"
                        style={{
                          width: `${workspaceData.systemMetrics.diskUsage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Statistics</CardTitle>
                  <CardDescription>Request performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold ">
                        {workspaceData.systemMetrics.totalRequests.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Total Requests
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold ">
                        {workspaceData.systemMetrics.activeConnections}
                      </div>
                      <div className="text-sm text-gray-500">
                        Active Connections
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold ">
                        {workspaceData.systemMetrics.avgResponseTime}ms
                      </div>
                      <div className="text-sm text-gray-500">
                        Avg Response Time
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold ">
                        {workspaceData.systemMetrics.errorRate}%
                      </div>
                      <div className="text-sm text-gray-500">Error Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppContainer>
  );
}
