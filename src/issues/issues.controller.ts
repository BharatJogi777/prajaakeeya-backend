import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "../common/guards/optional-jwt-auth.guard";
import { IssuesService } from "./issues.service";
import { CreateIssueDto } from "./dto/create-issue.dto";
import { UpdateIssueDto } from "./dto/update-issue.dto";
import { CreateHandRaiseDto } from "./dto/create-hand-raise.dto";
import {
  CurrentUser,
  AuthUser,
} from "../common/decorators/current-user.decorator";

@ApiTags("Ward Issues")
@Controller("issues")
export class IssuesController {
  constructor(private readonly service: IssuesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create a civic issue for an election constituency",
  })
  @ApiQuery({
    name: "electionId",
    required: true,
    type: Number,
    description: "Election ID",
  })
  @ApiQuery({
    name: "constituencyId",
    required: true,
    type: Number,
    description: "Constituency ID (parliamentary/assembly/ward)",
  })
  @ApiResponse({ status: 201, description: "Issue created" })
  create(
    @CurrentUser() user: AuthUser,
    @Query("electionId") electionId: string,
    @Query("constituencyId") constituencyId: string,
    @Body() dto: CreateIssueDto,
  ) {
    return this.service.createIssue(
      user.id,
      Number(electionId),
      Number(constituencyId),
      dto,
    );
  }

  @Post("hand-raise")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Hand-raise (toggle) for a category in an election constituency",
  })
  @ApiQuery({
    name: "electionId",
    required: true,
    type: Number,
    description: "Election ID",
  })
  @ApiQuery({
    name: "constituencyId",
    required: true,
    type: Number,
    description: "Constituency ID",
  })
  @ApiResponse({ status: 200, description: "Hand raise toggled" })
  handRaise(
    @CurrentUser() user: AuthUser,
    @Query("electionId") electionId: string,
    @Query("constituencyId") constituencyId: string,
    @Body() dto: CreateHandRaiseDto,
  ) {
    return this.service.createHandRaise(
      user.id,
      Number(electionId),
      Number(constituencyId),
      dto,
    );
  }

  @Get("categories")
  @ApiOperation({ summary: "Get supported issue categories" })
  @ApiResponse({ status: 200, description: "Categories returned" })
  categories() {
    return this.service.getCategories();
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "List public issues with optional caller-specific hand-raise state",
    description:
      "Public endpoint. When a valid Bearer token is supplied, each category includes isRaised for the authenticated user. Anonymous callers receive public counts only.",
  })
  @ApiQuery({
    name: "electionId",
    required: true,
    type: Number,
    description: "Election ID",
  })
  @ApiQuery({
    name: "constituencyId",
    required: true,
    type: Number,
    description: "Constituency ID",
  })
  @ApiResponse({ status: 200, description: "Issues returned" })
  list(
    @Query("electionId") electionId: string,
    @Query("constituencyId") constituencyId: string,
    @CurrentUser() user?: AuthUser,
  ) {
    return this.service.listIssues(
      Number(electionId),
      Number(constituencyId),
      user?.id,
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single issue by ID" })
  @ApiParam({ name: "id", type: "number" })
  @ApiQuery({ name: "electionId", required: true, type: Number })
  @ApiQuery({ name: "constituencyId", required: true, type: Number })
  getOne(
    @Param("id") id: string,
    @Query("electionId") electionId: string,
    @Query("constituencyId") constituencyId: string,
  ) {
    return this.service.getIssue(
      Number(electionId),
      Number(constituencyId),
      Number(id),
    );
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update an issue (owner or admin)" })
  @ApiParam({ name: "id", type: "number" })
  @ApiQuery({ name: "electionId", required: true, type: Number })
  @ApiQuery({ name: "constituencyId", required: true, type: Number })
  update(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Query("electionId") electionId: string,
    @Query("constituencyId") constituencyId: string,
    @Body() dto: UpdateIssueDto,
  ) {
    return this.service.updateIssue(
      user.id,
      Number(electionId),
      Number(constituencyId),
      Number(id),
      dto,
    );
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete an issue (owner or admin)" })
  @ApiParam({ name: "id", type: "number" })
  @ApiQuery({ name: "electionId", required: true, type: Number })
  @ApiQuery({ name: "constituencyId", required: true, type: Number })
  delete(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Query("electionId") electionId: string,
    @Query("constituencyId") constituencyId: string,
  ) {
    return this.service.deleteIssue(
      user.id,
      Number(electionId),
      Number(constituencyId),
      Number(id),
    );
  }
}
